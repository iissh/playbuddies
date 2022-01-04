const getMatchUserInfo = (users, userLoggedIn) => {
    const nUsers = { ...users };
    delete nUsers[userLoggedIn];

    const [id, user] = Object.entries(nUsers).flat();

    return { id, ...user };
};

export default getMatchUserInfo;