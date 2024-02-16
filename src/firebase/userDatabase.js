import { ref, push, getDatabase, set, query, equalTo, get, orderByChild } from "firebase/database";
import { getAuth, onAuthStateChanged, importUsers, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence  } from "firebase/auth";
import { async } from "regenerator-runtime";

const db = getDatabase();

// User Id functionality will be added in a different PR
let userId;

// Get the Firebase authentication instance
const auth = getAuth();

// Listen for changes to the authentication state
// and update the userId variable accordingly
onAuthStateChanged(auth, (user) => {
userId = user.uid;
});

const UserPermissions = {
    Admin: 'Admin',
    Developer: 'Developer',
    Teacher: 'Teacher',
    Student: 'Student',
};

export const writeNewUserToDatabase = async (userEmail, userRole) => {
    // Create a new date object to get a timestamp
    const dateObj = new Date();
    const timestamp = dateObj.toISOString();

    console.log("Current User");

    // Get the Firebase authentication instance
    const auth = getAuth();

    // Log information about the current user, if one exists
    const currentUser = auth.currentUser;


    await createUserWithEmailAndPassword(auth, userEmail, "welcome")
    .then((userCredential) => {

        console.log("User created successfully:", userCredential.user);

        // Additional user information
        const user = userCredential.user;
        console.log("New User UID:", user.uid);
        console.log("New User email:", user.email);
        console.log("New User display name:", user.displayName);

        const newID = user.uid;
        const newEmail = user.email;
        const newRole = userRole;
        // lets addd user to the realtime database now
    
        writeCurrentUserToDatabaseNewUser(newID, newEmail, newRole);
        alert("User Created")


    })
    .catch((error) => {
        console.error("Error creating auth user", error);
        // Handle errors (e.g., invalid email, weak password)
        alert("Error Creating the User")
    });



};

export const writeCurrentUserToDatabaseNewUser = async (newID,newEmail,newRole) => {
    // Create a new date object to get a timestamp
    const dateObj = new Date();
    const timestamp = dateObj.toISOString();

    userId = newID;
    console.log('User ID:', userId);

    const userEmail = newEmail;
    console.log(`User Email: ${userEmail}`)

    const userRole = newRole;
    console.log(`User Role: ${userRole}`)

    const userOrg = "Minnesota State University, Mankato"
    console.log(`User Org: ${userOrg}`)

   // Extract username from email
    const userName = userEmail.split('@')[0];
    console.log(`User Name: ${userName}`);

    // db path
    // ref the realtime db
    const userPath = `Users/${userId}`;

    // Check if user already exists in the database
    const userSnapshot = await get(ref(db, userPath));

    if (userSnapshot.val() !== null) {
        // User already exists, do not add again
        // alert("User already exists in the database.");
        return false;
    }

    const promises = [
        set(ref(db, `${userPath}/userId`), userId),
        set(ref(db, `${userPath}/userName`), userName),
        set(ref(db, `${userPath}/userEmail`),userEmail ),
        set(ref(db, `${userPath}/userRole`),userRole),
        set(ref(db, `${userPath}/userOrg`),userOrg),
        set(ref(db, `${userPath}/dateCreated`),timestamp),
        set(ref(db, `${userPath}/dateLastAcccessed`),timestamp),

    ];
    return Promise.all(promises)
    .then(() => {
        // alert("User successfully published to database.");
        return true;
    })
    .catch(() => {
        alert("OOPSIE POOPSIE. Cannot publish user to database.");
        return false;
    });
};

// returns the user role
// // Example usage:
// // Assuming userId is available
// getUserRoleFromDatabase(userId)
// .then((userRole) => {
//     if (userRole !== null) {
//         console.log(`User Role: ${userRole}`);
//     } else {
//         console.log("User not found in the database.");
//     }
// })
// .catch((error) => {
//     console.error("Error retrieving user role:", error);
// });
export const getUserRoleFromDatabase = async (props) => {
    const userPath = `Users/${userId}`;

    // Get the user snapshot from the database
    const userSnapshot = await get(ref(db, userPath));

    if (userSnapshot.exists()) {
        // User exists, return the user's role
        return userSnapshot.val().userRole;
    } else {
        // User does not exist in the database
        return null;
    }
};

export const getUserNameFromDatabase = async (props) => {
    const userPath = `Users/${userId}`;

    // Get the user snapshot from the database
    const userSnapshot = await get(ref(db, userPath));

    if (userSnapshot.exists()) {
        // User exists, return the user's role
        return userSnapshot.val().userName;
    } else {
        // User does not exist in the database
        return "USER NOT FOUND";
    }
};

export const changeUserRoleInDatabase = async (userId, newRole) => {
    console.log(userId)
    const userPath = `Users/${userId}`;

    // Get the user snapshot from the database
    const userSnapshot = await get(ref(db, userPath));

    if (userSnapshot.val() === null) {
        // User does not exist, handle accordingly
        alert("User does not exist in the database.");
        return false;
    }

    const promises = [
        set(ref(db, `${userPath}/userRole`), newRole),
    ];

    return Promise.all(promises)
        .then(() => {
            // alert("User role successfully changed in the database.");
            return true;
        })
        .catch((error) => {
            console.error("Error changing user role:", error);
            alert("OOPSIE POOPSIE. Cannot change user role.");
            return false;
        });
};

// return a list of users by organization
export const getUsersByOrganizationFromDatabase = async (organization) => {
    try {
        const usersRef = ref(db, 'Users');
        const usersQuery = query(usersRef, orderByChild('userOrg'), equalTo(organization));
        
        console.log('Executing users query...');
        const usersSnapshot = await get(usersQuery);

        if (usersSnapshot.exists()) {
            console.log('Users found for organization:', organization);
            const usersList = [];

            // Loop through the users and add them to the list
            usersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();
                usersList.push(userData);
            });

            console.log('Userlist:', usersList);
            return usersList;
        } else {
            console.log('No users found for organization:', organization);
            // No users found for the given organization
            return [];
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};




