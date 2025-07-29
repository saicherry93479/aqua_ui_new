import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Svg, { Path } from 'react-native-svg';
import { SHEET_IDS } from '../sheets';

const { width } = Dimensions.get('window');

const AquaHomeProductPage = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState('BASIC');
    const [selectedDuration, setSelectedDuration] = useState('360');
    const [currentReview, setCurrentReview] = useState(1);
    const scrollViewRef = useRef(null);
    const navigation = useNavigation()

    const productImages = [
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0QDRUPDw8PFQ8PEA8QEBAQDRUQEBYQFREWFhcVFRUYHSggGBslGxUVIjEhJSkrLi4uFyAzOD8sNygtLisBCgoKDg0NGBAQGisdHx0tLS0tLS0tNS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0rLS0tLS0tLSstLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABAECAwUGBwj/xABOEAABAwIEAQcHBggLCQAAAAABAAIDBBEFEiExBhMiQVFhcZEHFDKBobHBIyQ0QlLRQ2KCkpOUsvAVFiVUY3N0wtLh8QhEU3KDorTD0//EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAeEQEBAQEAAwEAAwAAAAAAAAAAARECITFBEjJhcf/aAAwDAQACEQMRAD8A9xREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFREQEVVRAVVbI9rWlziA1oJJJsABuSehQ6LE4pwXU7g9rTlL7ODCbX5riLPGu7bhBORYbv6S0LA6shGhqI79XKN9yCaqKA6up/wDi3/5bu/ZCwvxSlG5l9UE7vc1BtbpcLTfw1R/036rP8WocapPszfqsv+FBubhLhaf+GqT7MvrppR/dV7MVpXbCX9Xlt+yg210Wu89g/pf0Mv8AhQVkH23jvZIPeEGxRQWVMRIa2cZnaNbmFyd9Bv0LJM6RjC4c8gEhgADnHqFyBfvKCUigUWLQyv5LnsmAuYpWGN5A3Lb6PAuNWkjVT0BERAREQEREBERBRVVFVBRVVEQVREQcfiEraytfHJrS0b2t5L6ktRYOLnj6zWXADTpmBPQLdHQy5thzbaHo9S47CoHNE99319Zr02NW8e73rtYGANFtgt9ekYKxkQka+UMsQWgvtYHfp/fRSGSRAc3Lb8UX9yyrXY7WTxRNdDyd3SNY50jXOaA4Gxs0i5zZRv0rCpM1S22jXnuiefcFAqJHEc2KU/8ASI961D8crWm0klOL6i1O8aet5XC4h5U6yORzOUjbkda5oHWI7PlNdlr81Nd3UU9Q7amnOt9ox+04KrYakD6HU/pIP/ovPW+VSsO1Q31Yfbwu9Z2+VWo6ZDfsom2/bUw13TIKoH6HU+t8B/8AYp9HyzW2dTTDX+jPucV5w3yo1b3BscjRe989HrYdQDiuywziaWSEPdUxZjfTzax3ttnTDXUR1NhrFL+j+5WmsZ0sm/V5D7mrn3Y5Um+SeHQEm9Mdvz+5S+E8YqKl8zZTG5sPJgPjjLOc4Elti43sMvimDYhwllZla7K15e7MxzdAx1tx9ojwUqueQzTr9ikXWGpaSNP3ukVpakMnjykkG+aORvpxyDZzepw9o01BW3wqqdLA17rZ+cyQN9HlGOLH27MzSubLy2aRnQJIdO1wdf3DwW74b+jk9dRWf+TIunc8Mz22iIi5NCIiAiIgIiIKKqIgoiqiAiIg5WCG3K9lXO7xnzfFdCA7KLW7bn4dK1lE0cpNpctqJSB2lkbh71tI36LVqMgKsqYGSMMcjQ5jhZzTsQqxnT7lesq0D8KwgWDmU3N2zy3tr+M5YHwYADZzMOuASbsicQ3p9Sn0sFSyRzTFG6LnZHB4B1eSLi32SB3jtWjrcKxh1W+aM04jMeRgfKcw5xINgy3SFuf6xXLcf4DSVk0HmMMLmCJ9/N8sbLl43sLE/ctdhnkzZIzM5mXWwG/QNf36l0eMYzXUEkcVXJrKHOYYIw8aOsQ4lnNVtHxrZ5zOmeLDQxtsNRqMrQelbm/Gbn1iwLgaloKiOolazLymVxdGHNAcx1r721tr3Lvf5O+zTfom/ctFR8SecPEMQc18mUAva5jdQT6VtdG7DrW5igrxYExWzc60rvR7LtWet+tc/wBKubhh0LKWxBB+SZYjt0U3DqWmjZ82jiZG85/kmNa1xta/N32UDGqeukGWARAFkjSXSEc4gBptlN7arZ0UHJxMj3yMa0nrIGp9ZuVhpnUeR7WuuS7XoALh1aALOoNRKL7bJFa2tpbVBfpkllhtY3N2NcHAjoN1ssAHzcdstS7xqJD8VrXOcasAm7M7Hs7jECfbdbPh83o4j9pmb84k/Fb6/in1sERFzUREQEREBERAREQEREBERBzkbyJqq17tqQQe+kpz96ur5WOaWzZmMBux4NszrEWA61key09R+M+N3jTtb/dV9TQCeNozZcvOvluunFmzfDPXpJoHBrjEHE5GtF3DUkCxJN9SbqeFrG1UUcjYy9pkkf0WBLi0na9wNPctmFitNRimJTR1McTGMLJG3LnE39MNNgOoEeK8z4k8qeL01ZLTxUEUjYpHMDxHK+9jYXyuXrdZRwyZTI0HIbtNy0g94PYPBaebBcHMhe9lOZC4lxdNzsx3Ju5PCPnvjjijFcTfE+ekdEYWuaBHBI0HMQTfMTfZc/S0la5+kEpIHRA77l9CY9QUkcrBRiFrOTdn5NzS30hYnnb/AOayYHSsBOd4vbSxbtfsJWsTXkPCxxOmqWTx0kjnxm7AYH2zWIuQBqLEjo3Xq3D/ABfi89VFFUUkcUcji1zjFIHejpbMeu3XuuhyU92B5byZfZwc4ZSMrtD1hTIm4Y0jK6lBDgW2kZ6XZrulGvbjdUMW8zIhMRY1wIY4Sa5r65raBp6OpdOokFJTGXl2MiMoBZyjbFwB1Iv0KWsNI9fUiKPMQTchtmi51K180oc242KmVUny0bOsPcfUAB7yocdM3k32OrXznKOrlXkLUGGKxML+kRyX/JuPip3DY+YU/bTwnxYCokbMsbB1QSO8XArYYKzLRwt6oIR4Rha69J9TURFzUREQEREBERAREQEREBERBpqg/OZR+JTu8eVH91XQumdCBHkF2HV1z9XTQW6em6xVv0uTtp6U+Es9/eFlwU/JtFyejVaniJXNcU0Fe201JCySYOidmEjWOGXLcDOQLHLvvYruWuuL9Yuoc+ykUp5g7NEt2CldCXxOYN3NNuq/Rf1rxzHeBcZlxCWoiiIY+WRzR5xG3mkaaZv3svalx/EXGctJLkFJnBe9gcZ8hJaAfRDTpYjfrUlpY8R4oocSw50bK0Obyoc5gFUZRYEA+jcDcKPhHEjWP1mlGh0u47kf5qV5S+L5sVlZ80dD5tyrD8pylzm1N7DqWh4b4flqJDc5bAdWxB+5anVZsj0XhziE1MraeN0j5JQWtYH5buyl1iXaAWB1XZtwDETJA7kCBFMJH3qIzcXbtY9QK4Lgzh+op61k7MrpIJCQx7srXWDmkXFyNCejoXqEXFFZnc11LAAy+a1S8nQA6Dkxff2FW20kkdJh8LmhxcAC5xNgQbDcbd5UpWQvLmNcRYua0lt72JGyvvbXqXNtxuLjFHYrnhhHm0TAwSOe0NJykuNr5tC623QtnhEczDLyrmFjnF2bUOs/U6bXzFwHZZaHh/iuGWpfEXyBz5HuHKub0gEBjQNtfeunleOSkFxbJcgdHUunmTEQ4qoyRyynQcnUZR1NbcAeDQt/SttG0dTGjwAXKUrA3D5LfzeoO/WXn4rrwLBTr0fVURFhRERAREQEREBERAREQEREGnxNvzkdbodfyZR/jUTDpjGwl4IaDcO3Fi6w29Sl4sCamID60M4PcJIP81xOL09e6N3J1DBEGnm6h/pdB6DoNbhb5mwd7WPABN9N/FWYVWMcSwOGa2YDptsT7R4rzDygy1DsPp5myS6wvifaR4u+F+XMbHc3XP8Akjxd8eMxske4ioZLCczy7nFudu562AetM8I+ggtJjXCtFVytlnY8vYczS2VzOdly30O9gB6luwhWFcW/yX4I4kup5CXEkk1UupO/1lIovJ3hEN+ShkbnFnfOZTcWItq7tK6tEGlg4VomG7WyA6f7xJ0C21+pZhgFKHZsr7m17zPINusXW0RDBYa4/JO1Iu0i43WZcT5T+JpKGGJkL2NlndIbvaHjI1oB5p7XjwVk24luRoKRmH000vmpE1ZC6VrYpJ+aHBx0YzNYAXPt2W8raoQYa94DWvne0OaH5iJXDPIL9Nre1eecFVNPJPO6oiiNhJUcrkIdYzXJsNhz1ueJ6yNrI6aIZY4Q8lu3ykjsxPhb2rt7M8usoHl1AG/bp7fnf6ruVwmAWNFD2tp2+MkY+K7tY7BERc1EREBERAREQEREBERAREQarF47zROuWjLOwvAvlLg0i/5q0RwKkB59aTe+jgLeC7B50Vmbv8CrtHGYlw3S1NGKU11g2V8ge1jSeeNW2va19VqsF8neHUkzJ/Ow+SF7ZGOeMtnNN9mvA8QvSmnv8FV1rJtBpvqNiqlY4jp3aeCvUGsrMQljkLRES35PLYXzB2bM4m/NDbC+517QtdXY5Wta8xUZkcyWJrWZi3PG7QkOsbWIzXI2cBuuiKqEHMU3EGJPkYx2GFrXvyveZ7hgzAZrZBfQl1tNGnZdOERBVefeULgk4lVsldVxRshhEbGOBzBxcXOduBrzB+SvQVFo42Ou8taS5xNy3W3Rr3JLg834d4Bho5xP/CsReNxZouOkHn9i2WM8G0dZUvndiDgZCDkiaxwHNA0OvUu/NhsPAKwuPar+qORoMDZTRxwxVFTNaenytfEMrWNmY9xzNaLCzekrtFGZcuGnapKW6CIigIiICIiAiIgIiICIiAiIgtk28Peo9VUsijMkjg1rRckqRJse5cxxw6HzYB7iJM14hc2JFgb9GxWO+vzza1zN6kb6gq2yxtkZfK8XFxY2v1KUV4vhfHuJxuEFqONsTzGGyAB/Jg811+U1u0g7dJ6l6tw7XvqKYSPLC65BLPR6CLeKvN2SpZlTIzqR61kWK9n99wst1pFFBr8ZoqeRkVRUwRSTG0TJZmsc83tzQTrropy+evLab4zIDr82gAv1ZXae0+KD6GVVGw8kwRk7mKM3/ICkoMVU/LG49NiB3nQK6mZZgHYsFcb5W/acPAfuFLbsgskKxOKvlWMoi6H0vV8QpCjweke74qQiiIiAiIgIiICIiAiIgIiICIiCjtvUuW4ujcfNnCSmYPOo2SecloD43bsZcG7jbQCxOmui6lcpxswGlY40jqksqYHCNj3McDcjNdoJI1tY6c7WwuUovpcHhL+e2hJNrEUzC8n1rpKaBsbA1oaAPstDR4BaSgY0PJbSgHTUyN113C34QRqg2N+qxWZYqgK6B12Dw8NEF6+d/Lgf5af/AGWD3OX0QvnLy7SZcbf20lPb/vQfQmGfR4v6mL9gKUomFfRov6mL9gKWEER3OnHUxvtP7hTVBotXOf1uNu4aD3KcgxSbrEVkkKxlEX0257h8VIUel3Pq+KkIoiIgIiICIiAiIgIiICIiAiIgLRcQ4Y+qpnQMqJIHFzHCWL0hlcDbcaG3Wt6op3PeUEGHD3B1zPMR1F9vaFtYhZoFybdJNysAWdmyIsnCxUx3HbfxWebZRA7K7N0bHuRUtfN3l9H8uH+yU/vevpAEHUbL5z/2gIHjGsxFmuo4cpOgNnPBt12+KD6Dwj6LD/Uw/sBZ535WF3UD49CwYSCKWIOBBEMQIO4OQXCpVvzERjrBf6tQEGSgZZgHYpRVkQ0V7kGB6sKvcrCiMlL094WdYKXY9/wCzooiIgIiICIiAiIgIiICIiAiIgKK/c96lKNL6RQWrPFssCzRIisuyiFTXjRQ3jVBa3MPRPqOoXj/AJWOKsSpcUZGI4HRNZHNTB9I2V2c81wa519cwG1jq3sXsTOnuXI8Uh8tRGI6V8rS7ki8GPmkHUszOBBAJ6tQOrQOnpZKh8LDIWteY2GTKLHOWjNbq1us0UYboFZRzNfE1zb2LRodxbQg6nX1rMxBJj2VXKrVR6KwlWFXEqwojNTbetZlip/R9ZWVFEREBERAREQEREBERAREQERWuNgguUKonaHltxcAXHesNXiL2bMJ9S0NRjQ5UulZINALtjzbE7i/ag6NsgPSPFSIVxsuK0z3AtqpYiBYjkiGnW+ocwi/co1LxZCDrPOOySiB9rCg9AKiyjVc8zjKjt9JZf8AGppW+5UZxVRkc6qjza+iHhvZ6QQb74iy5LGS5lXhzMpcPO6p4INrOu5xvr22/wBVsW8RUX87i9cllz/EFa1+I4c6F8T4xNWOzBxddwiub20tzkR2eHMAaSAAHSSvsOt0jnE+skn1qdGufjx6ha0AVcNh1Sg9vQr2cTUAOtXH6nE+5B0wVshXNt4woR6VTGRrbK2Rx7NmrVYhxdTOZI1lS/M+/JuFO85DYAAAgXG+5vqiuwLgsUk7Bu4Li6PiCmJu+on5rQOfC4ZiYw0kBpOoIJ6PT6dCMkfEFKxga3zh5F7EQEXPe4hEd1RSB0Yc3Yl2trfWIWdcPhfEs2UN5FwA207V0VJij37sPgitsisjfcK9AREQEREBERAREQEREBERBaWA7geCxOpIjuxvgs6IIT8JpjvG3wWF2A0h/BhbNEGndw1Rn8GsbuFaM/UW8RBoDwlRfY9gT+KVHcHKbsLi3sLhZ1uq40K36IOf/ihRfZ9gVRwlR/Y9gW/RBom8KUY+p7lkbwzRj8GtyiDVt4fpB+DCzMwimG0bfBTkQYGUcQ2Y3wWVsbRsB4K5EBERAREQEREBERAREQEREFEVUQUVURAREQEREBERAREQEREBERAREQEREBERAREQEREH/9k=",



    ];

    // All useEffect and useLayoutEffect hooks
    useLayoutEffect(() => {
        navigation.setOptions({
            // headerShadowVisible:false,
            headerTitle: () => (
                <Text className='text-lg' style={{
                    fontFamily: 'PlusJakartaSans-Bold'
                }}>RO+ Water</Text>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => null, // Remove back button
        });
    }, [navigation]);

    const reviews = [
        {
            text: "Good service! They have the option for relocation as well. Have been using the drink prime service for close to 3 years now.",
            author: "Richa Sharma",
            rating: 5
        },
        {
            text: "Overall experience was good in terms of delivery to installation, it was delivered the very next when I made the payment and installed on the same day.",
            author: "Shubham Singh",
            rating: 5
        },
        {
            text: "Excellent purifier, purifies water well, drink prime has improved my family health and wellness, able to connect wifi with the device.",
            author: "Sampath Meda",
            rating: 5
        },
        {
            text: "Good Product and Installation was really fast and smooth. Quality Test was done In front of us very transparent application and services.",
            author: "Sridhar Kulkarni",
            rating: 5
        },
        {
            text: "I never thought it would be so easy to get a good purifier on rent. Their service is so prompt, I got my purifier delivered and installed within 12 hours. Also their app is very user friendly",
            author: "Pratik Dasgupta",
            rating: 5
        }
    ];

    const LeftArrowIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.5 19L8.5 12L15.5 5" stroke="#14142B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const StarIcon = ({ color = "#D86A00" }) => (
        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <Path d="M6.61958 1.17082C6.73932 0.802295 7.26068 0.802296 7.38042 1.17082L8.70631 5.25147C8.75986 5.41628 8.91344 5.52786 9.08673 5.52786H13.3774C13.7649 5.52786 13.926 6.02371 13.6125 6.25147L10.1413 8.77345C10.0011 8.87531 9.94243 9.05586 9.99598 9.22066L11.3219 13.3013C11.4416 13.6698 11.0198 13.9763 10.7063 13.7485L7.23511 11.2265C7.09492 11.1247 6.90508 11.1247 6.76489 11.2265L3.29368 13.7485C2.98019 13.9763 2.5584 13.6698 2.67814 13.3013L4.00402 9.22067C4.05757 9.05586 3.99891 8.87531 3.85872 8.77345L0.387506 6.25147C0.0740204 6.02371 0.235132 5.52786 0.622621 5.52786H4.91327C5.08656 5.52786 5.24014 5.41628 5.29369 5.25147L6.61958 1.17082Z" fill={color} />
        </Svg>
    );

    const HelpIcon = () => (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path d="M7.52417 2.5H3.7675C3.06748 2.5 2.5 3.06748 2.5 3.7675V7.52417C2.5 8.22419 3.06748 8.79167 3.7675 8.79167H7.52417C8.22419 8.79167 8.79167 8.22419 8.79167 7.52417V3.7675C8.79167 3.06748 8.22419 2.5 7.52417 2.5Z" fill="#9AD3BC" />
            <Path d="M16.2323 2.5H12.4756C11.7756 2.5 11.2081 3.06748 11.2081 3.7675V7.52417C11.2081 8.22419 11.7756 8.79167 12.4756 8.79167H16.2323C16.9323 8.79167 17.4998 8.22419 17.4998 7.52417V3.7675C17.4998 3.06748 16.9323 2.5 16.2323 2.5Z" fill="#B9B8EE" />
            <Path d="M7.52417 11.2084H3.7675C3.06748 11.2084 2.5 11.7759 2.5 12.4759V16.2325C2.5 16.9326 3.06748 17.5 3.7675 17.5H7.52417C8.22419 17.5 8.79167 16.9326 8.79167 16.2325V12.4759C8.79167 11.7759 8.22419 11.2084 7.52417 11.2084Z" fill="#F5B461" />
            <Path d="M16.2323 11.2084H12.4756C11.7756 11.2084 11.2081 11.7759 11.2081 12.4759V16.2325C11.2081 16.9326 11.7756 17.5 12.4756 17.5H16.2323C16.9323 17.5 17.4998 16.9326 17.4998 16.2325V12.4759C17.4998 11.7759 16.9323 11.2084 16.2323 11.2084Z" fill="#F07A74" />
        </Svg>
    );

    const InfoIcon = () => (
        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <Path d="M6.99987 13.4153C10.5144 13.4153 13.3635 10.5662 13.3635 7.05162C13.3635 3.53709 10.5144 0.687988 6.99987 0.687988C3.48533 0.687988 0.63623 3.53709 0.63623 7.05162C0.63623 10.5662 3.48533 13.4153 6.99987 13.4153Z" stroke="#4E4B66" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7 9.91683V7.5835" stroke="#4E4B66" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7 4.50586H7.00655" stroke="#4E4B66" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const RightArrowIcon = () => (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <Path d="M5.66675 3.33333L10.3334 8L5.66675 12.6667" stroke="#4548B9" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const LargeStar = () => (
        <Svg width="18" height="17" viewBox="0 0 18 17" fill="none">
            <Path d="M8.52447 0.963525C8.67415 0.50287 9.32585 0.50287 9.47553 0.963525L11.1329 6.06434C11.1998 6.27035 11.3918 6.40983 11.6084 6.40983H16.9717C17.4561 6.40983 17.6575 7.02964 17.2656 7.31434L12.9266 10.4668C12.7514 10.5941 12.678 10.8198 12.745 11.0258L14.4023 16.1266C14.552 16.5873 14.0248 16.9704 13.6329 16.6857L9.29389 13.5332C9.11865 13.4059 8.88135 13.4059 8.70611 13.5332L4.3671 16.6857C3.97524 16.9704 3.448 16.5873 3.59768 16.1266L5.25503 11.0258C5.32197 10.8198 5.24864 10.5941 5.07339 10.4668L0.734384 7.31434C0.342527 7.02964 0.543915 6.40983 1.02828 6.40983H6.39159C6.6082 6.40983 6.80018 6.27035 6.86712 6.06434L8.52447 0.963525Z" fill="#D86A00" />
        </Svg>
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        // <SafeAreaView className='flex-1'>
        <ScrollView className="flex-1 bg-white " showsVerticalScrollIndicator={false}>
            <View className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-y-8  relative   mb-10">
                {/* Product Image Carousel */}
                <View className="flex flex-col gap-4  w-full justify-self-center ">
                    <View className="overflow-hidden">
                        <Image
                            source={{ uri: productImages[selectedImage] }}
                            className="w-full  h-[350] "
                            resizeMode="cover"
                        />
                    </View>

                    {/* Thumbnail Navigation */}
                    <View className="flex flex-row gap-3 justify-center items-center">
                        <TouchableOpacity className="flex items-center w-[24px] flex-shrink-0">
                            <LeftArrowIcon />
                        </TouchableOpacity>

                        <View


                            className="flex flex-row gap-3 overflow-auto py-2 px-1"
                        >
                            {productImages.map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedImage(index)}
                                >
                                    <Image
                                        source={{ uri: image }}
                                        className={`w-[64px] rounded-lg ${selectedImage === index ? 'scale-110 border-2 border-blue-500' : ''}`}
                                        style={{ width: 64, height: 64 }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity className="flex flex-row items-center w-[24px] flex-shrink-0">
                            <View style={{ transform: [{ rotate: '180deg' }] }}>
                                <LeftArrowIcon />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Product Details & Pricing */}
                <View className="w-full  px-4 justify-self-start  ">
                    <View className="border rounded-t-2xl  text-title-active w-full">
                        {/* Header with Gradient */}
                        <View className="px-2 py-4 rounded-t-2xl bg-gradient-to-r from-purple-100 to-blue-100">
                            <Text
                                className="text-[20px]  text-black w-fit bg-mineral-gradient"
                                style={{
                                    fontFamily: 'PlusJakartaSans-ExtraBold',


                                }}
                            >
                                AquaHome RO+
                            </Text>
                            <Text
                                className="text-[15px] leading-[150%] text-gray-800 py-1 pb-1.5"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            >
                                Best RO+Mineral Water Purifier On Rent in Hyderabad
                            </Text>

                            <View className="flex flex-col gap-2">
                                <TouchableOpacity className="flex flex-row items-center gap-1.5 hidden">
                                    <Image
                                        source={{ uri: 'https://AquaHome.in/app/assets/people-profiles-img-production.webp' }}
                                        className="w-[68px] h-5 md:w-[72px] md:h-[22px]"
                                        resizeMode="contain"
                                    />
                                    <Text
                                        className="text-xs md:text-[17px] md:!text-xs"
                                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                    >
                                        <Text style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>8000+</Text> users subscribed in past month
                                    </Text>
                                </TouchableOpacity>

                                {/* <TouchableOpacity className="flex  flex-row gap-2 items-center">
                                    <View className="flex flex-row gap-1 items-center">
                                        <StarIcon />
                                        <Text
                                            className="text-orange-600"
                                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                        >
                                            4.8
                                        </Text>
                                    </View>
                                    <Text
                                        className="text-orange-600"
                                        style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                    >
                                        - 4,880 ratings
                                    </Text>
                                </TouchableOpacity> */}
                            </View>
                            <View className="w-full h-px bg-gray-200 my-4" />
                            <View className="flex flex-row justify-between">
                                <View>
                                    <Text
                                        className="text-[13px] text-gray-700 leading-[120%] mb-1"
                                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                    >
                                        7-days FREE
                                    </Text>
                                    <View className="flex flex-row items-end gap-1">
                                        <Text
                                            className="text-[32px] leading-tight text-green-600"
                                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                        >
                                            ₹299
                                        </Text>
                                        <Text
                                            className="text-xl text-gray-600"
                                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                        >
                                            /month
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex flex-col justify-center items-center  px-6 rounded-3xl bg-lime-100 shadow-sm">
                                    {/* <Text
                                        className="text-[10px] leading-[150%] text-gray-600"
                                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                    >
                                        25% discount
                                    </Text>
                                    <Text
                                        className="text-green-600 text-xs"
                                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                    >
                                        Savings of ₹1200
                                    </Text> */}
                                    <View className="flex flex-row gap-1 items-center">
                                        <StarIcon />
                                        <Text
                                            className="text-orange-600 text-xl"
                                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                        >
                                            4.8
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>


                    </View>

                    <TouchableOpacity className="w-full bg-[#4548b9] text-sm rounded-b-[24px] py-3.5 "
                        onPress={() => {
                            SheetManager.show(SHEET_IDS.ENQUIRY_SHEET, {
                                payload: {
                                    currentAmenities: [],
                                    availableAmenities: [], // Pass the extracted amenities
                                    onAmenitiesSelect: (amenities: string[]) => { }
                                }
                            });
                        }}>
                        <Text
                            className="text-white text-center"
                            style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                        >
                            Request For Installtion
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Reviews Section */}
                <View className="w-full flex flex-col gap-4  items-start  px-4 ">
                    <LinearGradient
                        colors={['#f5f3ff', '#eff6ff', '#e0f2fe']} // violet-50, blue-50, sky-100
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderRadius: 20
                        }}
                        className="px-6 md:px-8  w-full "
                    >
                        <View className="w-full pt-6 pb-3 md:pt-4  md:pb-3">
                            <View className="overflow-hidden">
                                <View className="flex flex-row">
                                    <View className="flex flex-col gap-4">
                                        <Text
                                            className="text-blue-900 text-sm leading-[25.20px] md:leading-snug"
                                            style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                        >
                                            {reviews[currentReview].text}
                                        </Text>
                                        <View>
                                            <View className="flex flex-row gap-2 text-sm">
                                                <Text
                                                    className="text-blue-900"
                                                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                                >
                                                    - {reviews[currentReview].author}
                                                </Text>
                                                <View className="flex flex-row gap-1 items-center">
                                                    <LargeStar />
                                                    <Text
                                                        className="text-orange-600"
                                                        style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                                    >
                                                        {reviews[currentReview].rating}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Review Dots */}
                            <View className="absolute bottom-1 md:-bottom-0.5 right-0">
                                <View className="flex flex-row justify-center gap-2 mt-4">
                                    {reviews.map((_, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className={`rounded-full w-2.5 h-2.5 border ${currentReview === index ? 'bg-[#4548b9]' : 'bg-gray-200'}`}
                                            onPress={() => setCurrentReview(index)}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View className="pt-2 pb-5 md:pb-3 border-t mt-2  border-gray-300 flex flex-row gap-1 md:justify-center items-center">
                            <Text
                                className="text-[#4548b9] text-[12px] md:text-center"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Check review in playstore
                            </Text>
                            <RightArrowIcon />
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </ScrollView>
        // </SafeAreaView>
    );
};

export default AquaHomeProductPage;