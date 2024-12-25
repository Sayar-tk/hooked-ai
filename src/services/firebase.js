import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const updateCreditsWithExpiry = async (
  creditsToAdd,
  isFreeCredits = false
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setDate(currentDate.getDate() + 30); // 30 days from today

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentCredits = userData.remainingCredits || 0;
      const newCredits = isFreeCredits ? 20 : currentCredits + creditsToAdd;

      await updateDoc(userDocRef, {
        remainingCredits: newCredits,
        creditsExpiryDate: expiryDate.toISOString(),
      });

      console.log(`Credits updated successfully: ${newCredits}`);
    } else {
      // Initialize credits on first-time setup
      await setDoc(userDocRef, {
        remainingCredits: isFreeCredits ? 20 : creditsToAdd,
        creditsExpiryDate: expiryDate.toISOString(),
      });
      console.log(`Credits initialized: ${creditsToAdd}`);
    }
  } catch (error) {
    console.error("Error updating credits with expiry:", error);
    throw error;
  }
};

export const restoreFreeCredits = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentDate = new Date();
      const expiryDate = new Date(userData.creditsExpiryDate);

      if (currentDate > expiryDate) {
        // Expiry reached, restore credits for free users
        await updateDoc(userDocRef, {
          remainingCredits: 20,
          creditsExpiryDate: new Date(
            currentDate.setDate(currentDate.getDate() + 30)
          ).toISOString(),
        });

        console.log("Free credits restored successfully.");
      }
    }
  } catch (error) {
    console.error("Error restoring free credits:", error);
    throw error;
  }
};

export const checkCreditsExpiry = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("User not authenticated. Skipping credit expiry check.");
      return; // Early exit if the user is not authenticated
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentDate = new Date();
      const expiryDate = new Date(userData.creditsExpiryDate);
      const daysToExpiry = Math.ceil(
        (expiryDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (daysToExpiry <= 5 && daysToExpiry > 0) {
        alert(`Your credits will expire in ${daysToExpiry} days.`);
      } else if (daysToExpiry <= 0) {
        console.log("Credits have expired. Resetting credits...");
        restoreFreeCredits(); // Automatically reset for free users
      }
    }
  } catch (error) {
    console.error("Error checking credits expiry:", error);
    throw error;
  }
};

// Deduct credits from the user's Firestore collection
export const deductCredits = async (creditsToDeduct) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authenticated.");

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) throw new Error("User data not found in Firestore.");

    const userData = userDoc.data();
    const currentCredits = userData.remainingCredits || 0;

    if (currentCredits < creditsToDeduct) {
      alert("Insufficient credits. Please top up your credits.");
      return false; // Abort the operation if not enough credits
    }

    await updateDoc(userDocRef, {
      remainingCredits: currentCredits - creditsToDeduct,
    });

    console.log(
      `Deducted ${creditsToDeduct} credits. Remaining: ${
        currentCredits - creditsToDeduct
      }`
    );
    return true; // Allow the operation to proceed
  } catch (err) {
    console.error("Error deducting credits:", err);
    alert("Error deducting credits. Please try again.");
    return false;
  }
};
