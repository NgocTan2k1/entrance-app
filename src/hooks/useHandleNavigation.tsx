import { useNavigate } from 'react-router-dom';

export const useHandleNavigation = () => {
    const navigate = useNavigate();

    const handleNavigation = (navigationURL: string) => {
        navigate(navigationURL);
    };

    return handleNavigation;
};
