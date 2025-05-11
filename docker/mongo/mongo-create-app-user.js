(function () {
    const USER = process.env.APP_USER.trim();
    const PWD = process.env.APP_PWD.trim();

    const videoDB = db.getSiblingDB('video_comments');
    const exists = videoDB.getUser(USER);

    if (exists) {
        print(`ℹ️  User ${USER} already exists`);
        quit();
    }

    print(`🔐 Creating application user '${USER}' ...`);
    videoDB.createUser({
        user: USER,
        pwd: PWD,
        roles: [{ role: 'readWrite', db: 'video_comments' }],
    });
    print('✅ App user created');
})();
