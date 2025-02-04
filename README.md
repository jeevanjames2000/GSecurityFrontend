# GSecurity

# GET the logged in user details

const storedUser = await AsyncStorage.getItem("authUser");
const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

# GET the CARD Data and violation card profile use homeSlice

const { cardData, image, noProfile, profile } = useSelector(
(state) => state.home
);

# GET the profile section of logged in security use profileSlice

const { profile, image } = useSelector((state) => state.profile);

# Home functions are there in useSearch() hook at ./hooks folder

# Auth folder for login and splash screen

# SearchCards for all the cards (violation card,visitorsCard,gatepass card)
