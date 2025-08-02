import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService } from '@/api/api';

export interface ServiceRequest {
  id: string;
  subscriptionId: string;
  customerId: string;
  productId: string;
  installationRequestId?: string;
  type: string;
  description: string;
  images?: string[] | null;
  status: string;
  assignedToId?: string;
  franchiseId: string;
  scheduledDate?: string;
  completedDate?: string;
  requirePayment: boolean;
  beforeImages?: string;
  afterImages?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  phone: string;
  role: string;
  name: string;
  city: string;
  alternativePhone?: string;
  firebaseUid: string;
  hasOnboarded: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  images: string[];
  rentPrice: number;
  buyPrice: number;
  deposit: number;
  isRentable: boolean;
  isPurchasable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Franchise {
  id: string;
  name: string;
  city: string;
  geoPolygon: string;
  ownerId: string;
  isCompanyManaged: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  connectId: string;
  requestId: string;
  customerId: string;
  productId: string;
  franchiseId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate?: string;
  currentPeriodStartDate: string;
  currentPeriodEndDate: string;
  nextPaymentDate: string;
  monthlyAmount: number;
  depositAmount: number;
  razorpaySubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  product: Product;
  franchise: Franchise;
  serviceRequests: ServiceRequest[];
}

export interface SubscriptionSession {
  connectId: string;
  subscription: Subscription;
  lastAccessed: string;
}

interface SubscriptionContextType {
  currentSession: SubscriptionSession | null;
  isLoading: boolean;
  
  // Session management
  createSession: (connectId: string, subscription: Subscription) => Promise<void>;
  endSession: () => Promise<void>;
  checkExistingSession: () => Promise<SubscriptionSession | null>;
  refreshSubscription: () => Promise<void>;
  
  // Service requests
  serviceRequests: ServiceRequest[];
  refreshServiceRequests: () => Promise<void>;
  createServiceRequest: (data: CreateServiceRequestData) => Promise<ServiceRequest>;
}

interface CreateServiceRequestData {
  productId: string;
  subscriptionId?: string;
  installationRequestId?: string;
  type: string;
  description: string;
  scheduledDate?: string;
  requiresPayment?: boolean;
  paymentAmount?: number;
  images?: File[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<SubscriptionSession | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const existingSession = await checkExistingSession();
      if (existingSession) {
        setCurrentSession(existingSession);
        setServiceRequests(existingSession.subscription.serviceRequests || []);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const createSession = async (connectId: string, subscription: Subscription) => {
    try {
      const session: SubscriptionSession = {
        connectId,
        subscription,
        lastAccessed: new Date().toISOString(),
      };

      await AsyncStorage.setItem('subscriptionSession', JSON.stringify(session));
      setCurrentSession(session);
      setServiceRequests(subscription.serviceRequests || []);
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const endSession = async () => {
    try {
      await AsyncStorage.removeItem('subscriptionSession');
      setCurrentSession(null);
      setServiceRequests([]);
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

  const checkExistingSession = async (): Promise<SubscriptionSession | null> => {
    try {
      const sessionData = await AsyncStorage.getItem('subscriptionSession');
      if (sessionData) {
        const session: SubscriptionSession = JSON.parse(sessionData);
        
        // Update last accessed time
        session.lastAccessed = new Date().toISOString();
        await AsyncStorage.setItem('subscriptionSession', JSON.stringify(session));
        
        return session;
      }
      return null;
    } catch (error) {
      console.error('Error checking existing session:', error);
      return null;
    }
  };

  const refreshSubscription = async () => {
    if (!currentSession) return;

    try {
      setIsLoading(true);
      
      const response = await apiService.post('/subscriptions/check', {
        connectId: currentSession.connectId,
        customerPhone: currentSession.subscription.customer.phone,
      });

      if (response.success && response.data.isValid) {
        const updatedSession: SubscriptionSession = {
          ...currentSession,
          subscription: response.data.subscription,
          lastAccessed: new Date().toISOString(),
        };

        await AsyncStorage.setItem('subscriptionSession', JSON.stringify(updatedSession));
        setCurrentSession(updatedSession);
        setServiceRequests(response.data.subscription.serviceRequests || []);
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshServiceRequests = async () => {
    if (!currentSession) return;

    try {
      setIsLoading(true);
      
      const response = await apiService.get('/service-requests', {
        params: {
          subscriptionId: currentSession.subscription.id,
        },
      });

      if (response.success && response.data) {
        setServiceRequests(response.data.serviceRequests || []);
      }
    } catch (error) {
      console.error('Error refreshing service requests:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createServiceRequest = async (data: CreateServiceRequestData): Promise<ServiceRequest> => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      setIsLoading(true);

      // Prepare form data for multipart/form-data
      const formData = new FormData();
      formData.append('productId', data.productId);
      formData.append('subscriptionId', data.subscriptionId || currentSession.subscription.id);
      formData.append('type', data.type);
      formData.append('description', data.description);

      if (data.installationRequestId) {
        formData.append('installationRequestId', data.installationRequestId);
      }
      if (data.scheduledDate) {
        formData.append('scheduledDate', data.scheduledDate);
      }
      if (data.requiresPayment !== undefined) {
        formData.append('requiresPayment', data.requiresPayment.toString());
      }
      if (data.paymentAmount !== undefined) {
        formData.append('paymentAmount', data.paymentAmount.toString());
      }

      // Add images if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await apiService.post('/service-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success && response.data.serviceRequest) {
        // Add the new service request to the list
        setServiceRequests(prev => [response.data.serviceRequest, ...prev]);
        return response.data.serviceRequest;
      } else {
        throw new Error(response.error || 'Failed to create service request');
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: SubscriptionContextType = {
    currentSession,
    isLoading,
    createSession,
    endSession,
    checkExistingSession,
    refreshSubscription,
    serviceRequests,
    refreshServiceRequests,
    createServiceRequest,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};