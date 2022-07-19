import { useEffect, useState } from "react";
import { db } from "../firebase/config";

export default function useFirestore(collection, condition) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createdAt", "asc");

    if (condition) {
      const { fieldName, operator, compareValue } = condition;
      if (!compareValue || !compareValue.length) {
        return;
      }
      collectionRef = collectionRef.where(fieldName, operator, compareValue);
    }

    const unsubscribed = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((snap) => ({
        ...snap.data(),
        id: snap.id,
      }));

      setDocuments(documents);
    });
    return () => {
      unsubscribed();
    };
  }, [collection, condition]);

  return documents;
}
