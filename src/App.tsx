/**
 * File: App.tsx
 * Deskripsi: Modul utama aplikasi MAGIKA (Kecamatan Cicalengka) yang mengelola
 * routing tampilan, otentikasi Firebase, listener Firestore real-time, serta state aplikasi.
 */

import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  MessageCircle,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
  AlertTriangle,
  ExternalLink,
  Map,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LandingPage from "./components/LandingPage.tsx";
import AuthPages from "./components/AuthPages.tsx";
import FormPage from "./components/FormPage.tsx";
import StudentDashboard from "./components/student/StudentDashboard.tsx";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import CamatDashboard from "./components/camat/CamatDashboard.tsx";
import TrackPage from "./components/TrackPage.tsx";
import { Application, User, ApplicationStatus } from "./types.ts";
import { db, auth, uploadToStorage } from "./firebase.ts";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  where,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<
    "landing" | "login" | "register" | "form" | "dashboard" | "track"
  >("landing");
  const [trackedAppId, setTrackedAppId] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [suratList, setSuratList] = useState<any[]>([]);

  const [whatsappLink, setWhatsappLink] = useState<string>(
    "https://chat.whatsapp.com/mock-magika-cicalengka",
  );

  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem("magika_is_offline") === "true";
  });

  // Sinkronisasi koleksi fallback yang disimpan di localStorage ketika aplikasi berjalan dalam mode offline.
  // Ini memungkinkan data tetap ditampilkan meskipun tidak ada koneksi Firebase.
  useEffect(() => {
    if (isOfflineMode) {
      console.warn(
        "MAGIKA is running in Offline Fallback Mode. Data is persisted locally in the browser.",
      );

      const storedUser = localStorage.getItem("magika_offline_user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }

      const storedUsers = localStorage.getItem("magika_offline_users");
      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch (e) {
          console.error(e);
        }
      }

      const storedApps = localStorage.getItem("magika_offline_apps");
      if (storedApps) {
        try {
          setApplications(JSON.parse(storedApps));
        } catch (e) {
          console.error(e);
        }
      }

      const storedSurat = localStorage.getItem("magika_offline_surat");
      if (storedSurat) {
        try {
          setSuratList(JSON.parse(storedSurat));
        } catch (e) {
          console.error(e);
        }
      }

      const storedWhatsapp = localStorage.getItem("magika_offline_whatsapp");
      if (storedWhatsapp) {
        setWhatsappLink(storedWhatsapp);
      }
    }
  }, [isOfflineMode]);

  useEffect(() => {
    if (isOfflineMode) {
      localStorage.setItem("magika_offline_users", JSON.stringify(users));
    }
  }, [users, isOfflineMode]);

  useEffect(() => {
    if (isOfflineMode) {
      localStorage.setItem("magika_offline_apps", JSON.stringify(applications));
    }
  }, [applications, isOfflineMode]);

  useEffect(() => {
    if (isOfflineMode) {
      localStorage.setItem("magika_offline_surat", JSON.stringify(suratList));
    }
  }, [suratList, isOfflineMode]);

  useEffect(() => {
    if (isOfflineMode) {
      localStorage.setItem("magika_offline_whatsapp", whatsappLink);
    }
  }, [whatsappLink, isOfflineMode]);

  // Pembantu seeding untuk mengisi koleksi Firestore dengan data awal jika belum ada.
  const seedFirebase = async (userRole?: string) => {
    // Hanya administrator atau camat yang diperbolehkan menjalankan seeding database agar tidak melanggar izin.
    if (userRole !== "admin" && userRole !== "camat") {
      return;
    }
    try {
      // Isi data konfigurasi pengaturan default jika belum tersedia di koleksi settings.
      const settingsSnap = await getDocs(collection(db, "settings"));
      if (settingsSnap.empty) {
        await setDoc(doc(db, "settings", "config"), {
          whatsappLink: "https://chat.whatsapp.com/mock-magika-cicalengka",
        });
      }
    } catch (err) {
      console.error("Failed to seed Firebase:", err);
    }
  };

  // Sinkronisasi data Firestore secara real-time untuk melihat perubahan data langsung di UI.
  useEffect(() => {
    if (isOfflineMode) {
      return;
    }
    // 1. Pendengar settings untuk menerima perubahan pengaturan seperti tautan WhatsApp secara real-time.
    //    Konfigurasi ini bersifat publik, bisa diakses oleh semua pengguna, termasuk tamu.
    const unsubSettings = onSnapshot(
      doc(db, "settings", "config"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.whatsappLink) setWhatsappLink(data.whatsappLink);
        }
      },
      (error) => {
        console.error("Settings Firestore subscription error:", error);
      },
    );

    let unsubUsers: (() => void) | null = null;
    let unsubApps: (() => void) | null = null;
    let unsubUserDoc: (() => void) | null = null;
    let unsubSurat: (() => void) | null = null;

    // 2. Menjaga sesi autentikasi Firebase dan membuat subscription berdasarkan peran pengguna.
    const unsubAuth = auth.onAuthStateChanged((firebaseUser) => {
      // Batalkan langganan listener yang sudah ada ketika status autentikasi berubah.
      if (unsubUsers) {
        unsubUsers();
        unsubUsers = null;
      }
      if (unsubApps) {
        unsubApps();
        unsubApps = null;
      }
      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }
      if (unsubSurat) {
        unsubSurat();
        unsubSurat = null;
      }

      if (firebaseUser) {
        // Ambil profil pengguna yang cocok dari koleksi users menggunakan UID Firebase.
        const userDocRef = doc(db, "users", firebaseUser.uid);
        unsubUserDoc = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as User;
              setCurrentUser(userData);

              // Jalankan seeding awal data hanya jika admin atau camat sudah masuk.
              seedFirebase(userData?.role);

              // Atur listener Firestore berbeda-beda sesuai peran pengguna.
              const userRole = userData?.role || "";
              if (userRole === "admin" || userRole === "camat") {
                // Staff (admin/camat) boleh menerima semua data pengguna secara real-time.
                if (!unsubUsers) {
                  unsubUsers = onSnapshot(
                    collection(db, "users"),
                    (snapshot) => {
                      const list: User[] = [];
                      snapshot.forEach((docSnap) => {
                        const data = docSnap.data();
                        if (data) {
                          const { id: _ignoredId, ...rest } = data as User;
                          list.push({ ...rest, id: docSnap.id } as User);
                        }
                      });
                      if (list.length > 0) {
                        setUsers(list);
                      }
                    },
                    (error) => {
                      console.error(
                        "Users Firestore subscription error:",
                        error,
                      );
                    },
                  );
                }

                // Staff (admin/camat) boleh menerima semua data pendaftar magang secara real-time.
                if (!unsubApps) {
                  unsubApps = onSnapshot(
                    collection(db, "pendaftar_magang"),
                    (snapshot) => {
                      const list: Application[] = [];
                      snapshot.forEach((docSnap) => {
                        const data = docSnap.data();
                        if (data) {
                          const { id: _ignoredId, ...rest } =
                            data as Application;
                          list.push({ ...rest, id: docSnap.id } as Application);
                        }
                      });
                      list.sort((a, b) =>
                        (b.id || "").localeCompare(a.id || ""),
                      );
                      setApplications(list);
                    },
                    (error) => {
                      console.error(
                        "Applications Firestore subscription error:",
                        error,
                      );
                    },
                  );
                }

                // Staff dapat menerima semua data surat secara real-time.
                if (!unsubSurat) {
                  unsubSurat = onSnapshot(
                    collection(db, "surat"),
                    (snapshot) => {
                      const list: any[] = [];
                      snapshot.forEach((docSnap) => {
                        const data = docSnap.data();
                        if (data) {
                          const { id: _ignoredId, ...rest } = data as any;
                          list.push({ ...rest, id: docSnap.id });
                        }
                      });
                      setSuratList(list);
                    },
                    (error) => {
                      console.error(
                        "Surat Firestore subscription error:",
                        error,
                      );
                    },
                  );
                }
              } else if (userRole === "student") {
                // Pelajar hanya dapat memantau aplikasi mereka sendiri melalui query yang difilter,
                // untuk mencegah kesalahan izin akses pada Firestore.
                if (!unsubApps) {
                  const studentEmailKey = (userData.email || "")
                    .toLowerCase()
                    .trim();
                  const studentQuery = query(
                    collection(db, "pendaftar_magang"),
                    where("userEmail", "==", studentEmailKey),
                  );

                  // Langganan utama: menggunakan email yang sudah dinormalisasi agar query lebih konsisten.
                  let primaryUnsub: (() => void) | null = onSnapshot(
                    studentQuery,
                    (snapshot) => {
                      const list: Application[] = [];
                      snapshot.forEach((docSnap) => {
                        const data = docSnap.data();
                        if (data) {
                          const { id: _ignoredId, ...rest } =
                            data as Application;
                          list.push({ ...rest, id: docSnap.id } as Application);
                        }
                      });
                      if (list.length > 0) {
                        list.sort((a, b) =>
                          (b.id || "").localeCompare(a.id || ""),
                        );
                        setApplications(list);
                      } else {
                        // Cadangan: beberapa dokumen lama mungkin menyimpan email dengan format kapital berbeda.
                        // Jika query utama tidak menemukan apa pun, ambil keseluruhan koleksi dan saring di sisi klien.
                        if (primaryUnsub) {
                          primaryUnsub();
                          primaryUnsub = null;
                        }
                        unsubApps = onSnapshot(
                          collection(db, "pendaftar_magang"),
                          (fullSnap) => {
                            const fullList: Application[] = [];
                            fullSnap.forEach((docSnap) => {
                              const data = docSnap.data() as
                                | Application
                                | undefined;
                              if (!data) return;
                              const docEmail = (data.userEmail || "")
                                .toLowerCase()
                                .trim();
                              if (docEmail === studentEmailKey) {
                                const { id: _ignoredId, ...rest } =
                                  data as Application;
                                fullList.push({
                                  ...rest,
                                  id: docSnap.id,
                                } as Application);
                              }
                            });
                            fullList.sort((a, b) =>
                              (b.id || "").localeCompare(a.id || ""),
                            );
                            setApplications(fullList);
                          },
                          (error) => {
                            console.error(
                              "Student fallback subscription error:",
                              error,
                            );
                          },
                        );
                      }
                    },
                    (error) => {
                      console.error(
                        "Student Applications Firestore subscription error:",
                        error,
                      );
                    },
                  );

                  // Simpan fungsi unsubscribe dari langganan utama sehingga bisa dibatalkan jika fallback aktif.
                  unsubApps = () => {
                    if (primaryUnsub) primaryUnsub();
                  };
                }

                // Pelajar hanya dapat menerima surat yang menyertakan mereka di field penerimaIds.
                if (!unsubSurat) {
                  const searchKeys = [
                    userData.id,
                    userData.email?.toLowerCase(),
                  ].filter(Boolean);
                  const studentSuratQuery = query(
                    collection(db, "surat"),
                    where(
                      "penerimaIds",
                      "array-contains-any",
                      searchKeys.length > 0 ? searchKeys : ["dummy_empty_val"],
                    ),
                  );
                  unsubSurat = onSnapshot(
                    studentSuratQuery,
                    (snapshot) => {
                      const list: any[] = [];
                      snapshot.forEach((docSnap) => {
                        const data = docSnap.data();
                        if (data) {
                          const { id: _ignoredId, ...rest } = data as any;
                          list.push({ ...rest, id: docSnap.id });
                        }
                      });
                      setSuratList(list);
                    },
                    (error) => {
                      console.error(
                        "Student Surat Firestore subscription error:",
                        error,
                      );
                    },
                  );
                }
              }

              // Arahkan pengguna ke dashboard secara otomatis jika mereka sudah masuk dan masih di halaman autentikasi atau landing.
              setCurrentView((prev) => {
                if (
                  prev === "landing" ||
                  prev === "login" ||
                  prev === "register"
                ) {
                  return "dashboard";
                }
                return prev;
              });
            } else {
              // Jika profil pengguna belum ada, coba cari data pengguna yang sudah dimuat berdasarkan email sebagai cadangan.
              const userEmail = firebaseUser.email || "";
              const matched = users.find(
                (u) =>
                  u &&
                  u.email &&
                  u.email.toLowerCase() === userEmail.toLowerCase(),
              );
              if (matched) {
                const updatedUser = { ...matched, id: firebaseUser.uid };
                setDoc(doc(db, "users", firebaseUser.uid), updatedUser);
                setCurrentUser(updatedUser);
                seedFirebase(updatedUser.role);
                setCurrentView((prev) => {
                  if (
                    prev === "landing" ||
                    prev === "login" ||
                    prev === "register"
                  ) {
                    return "dashboard";
                  }
                  return prev;
                });
              }
            }
          },
          (error) => {
            console.error("User document subscription error:", error);
          },
        );
      } else {
        setCurrentUser(null);
        // Reset semua state lokal ketika pengguna keluar dari aplikasi.
        setApplications([]);
        setUsers([]);
        setSuratList([]);
      }
    });

    return () => {
      unsubSettings();
      unsubAuth();
      if (unsubUsers) unsubUsers();
      if (unsubApps) unsubApps();
      if (unsubUserDoc) unsubUserDoc();
      if (unsubSurat) unsubSurat();
    };
  }, [isOfflineMode]);

  // Memperbarui profil pengguna yang sedang digunakan.
  // Password TIDAK disimpan ke Firestore. Password dikelola oleh
  // Firebase Authentication.
  const handleUpdateUser = async (updatedUser: User) => {
    try {
      // Buat salinan data profil dan pastikan field password, jika ada
      // dari kode lama, dibuang sebelum data dikirim ke Firestore.
      const safeUser = { ...updatedUser } as User & {
        password?: string;
      };
      safeUser.instansiPendidikan =
        safeUser.instansiPendidikan || safeUser.universitas || "";
      delete safeUser.password;
      delete safeUser.universitas;

      if (isOfflineMode) {
        setUsers((prev) =>
          prev.map((u) => (u.id === safeUser.id ? safeUser : u)),
        );

        if (currentUser && currentUser.id === safeUser.id) {
          setCurrentUser(safeUser);
          localStorage.setItem("magika_offline_user", JSON.stringify(safeUser));
        }

        return;
      }

      // Jika foto masih berupa Data URL, unggah ke Firebase Storage terlebih dahulu.
      if (safeUser.avatarUrl?.startsWith("data:")) {
        const url = await uploadToStorage(
          safeUser.avatarUrl,
          `avatar_${safeUser.id}.png`,
          "avatars",
        );

        safeUser.avatarUrl = url;
      }

      // merge: true agar field lain di dokumen users tidak ikut terhapus.
      await setDoc(doc(db, "users", safeUser.id), safeUser, { merge: true });

      // Sinkronkan state pengguna yang sedang login.
      if (currentUser && currentUser.id === safeUser.id) {
        setCurrentUser(safeUser);
      }

      // Sinkronkan daftar users jika data pengguna tersebut sedang ada di state.
      setUsers((prev) =>
        prev.map((u) => (u.id === safeUser.id ? safeUser : u)),
      );
    } catch (err) {
      console.error("Error updating user in Firestore:", err);
    }
  };

  const handleLoginWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const uid = credential.user.uid;

      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", cleanEmail));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const matchedDoc = qSnap.docs[0];
          const matchedData = matchedDoc.data() as User;
          const updatedUser = { ...matchedData, id: uid };
          await setDoc(doc(db, "users", uid), updatedUser);
          setCurrentUser(updatedUser);
        } else {
          throw new Error(
            "Akun terautentikasi, tetapi data profil tidak ditemukan di database.",
          );
        }
      } else {
        const userData = docSnap.data() as User;
        setCurrentUser(userData);
      }
      setCurrentView("dashboard");
    } catch (err: any) {
      if (
        err.code === "auth/network-request-failed" ||
        err.message?.includes("network-request-failed") ||
        err.message?.includes("network") ||
        err.message?.includes("offline")
      ) {
        setIsOfflineMode(true);
        localStorage.setItem("magika_is_offline", "true");
        const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
        if (matched) {
          setCurrentUser(matched);
          localStorage.setItem("magika_offline_user", JSON.stringify(matched));
          setCurrentView("dashboard");
          return;
        } else {
          const mockUser: User = {
            id: `mock-uid-${Date.now()}`,
            email: cleanEmail,
            namaLengkap: cleanEmail.split("@")[0],
            role: "student",
          };
          setUsers((prev) => [...prev, mockUser]);
          setCurrentUser(mockUser);
          localStorage.setItem("magika_offline_user", JSON.stringify(mockUser));
          setCurrentView("dashboard");
          return;
        }
      }
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found"
      ) {
        const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
        let existingUserInFirestore: User | null = null;

        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", cleanEmail));
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            existingUserInFirestore = qSnap.docs[0].data() as User;
          }
        } catch (dbErr) {
          console.error("Error checking existing user in Firestore:", dbErr);
        }

        if (matched || existingUserInFirestore) {
          try {
            const createCred = await createUserWithEmailAndPassword(
              auth,
              cleanEmail,
              password,
            );
            const newUid = createCred.user.uid;

            const finalUser: User = {
              id: newUid,
              email: cleanEmail,
              namaLengkap:
                existingUserInFirestore?.namaLengkap ||
                matched?.namaLengkap ||
                cleanEmail.split("@")[0],
              role: existingUserInFirestore?.role || matched?.role || "student",
              instansiPendidikan:
                existingUserInFirestore?.instansiPendidikan ||
                existingUserInFirestore?.universitas ||
                matched?.instansiPendidikan ||
                matched?.universitas ||
                "",
              prodi: existingUserInFirestore?.prodi || matched?.prodi || "",
              noHp: existingUserInFirestore?.noHp || matched?.noHp || "",
              avatarUrl:
                existingUserInFirestore?.avatarUrl || matched?.avatarUrl || "",
            };

            await setDoc(doc(db, "users", newUid), finalUser);
            setCurrentUser(finalUser);
            setCurrentView("dashboard");
            return;
          } catch (createErr: any) {
            console.error("Auto-registration of user failed:", createErr);
            if (
              createErr.code === "auth/network-request-failed" ||
              createErr.message?.includes("network")
            ) {
              setIsOfflineMode(true);
              localStorage.setItem("magika_is_offline", "true");
              const finalUser: User = {
                id: `mock-uid-${Date.now()}`,
                email: cleanEmail,
                namaLengkap:
                  existingUserInFirestore?.namaLengkap ||
                  matched?.namaLengkap ||
                  cleanEmail.split("@")[0],
                role:
                  existingUserInFirestore?.role || matched?.role || "student",
                instansiPendidikan:
                  existingUserInFirestore?.instansiPendidikan ||
                  existingUserInFirestore?.universitas ||
                  matched?.instansiPendidikan ||
                  matched?.universitas ||
                  "",
                prodi: existingUserInFirestore?.prodi || matched?.prodi || "",
                noHp: existingUserInFirestore?.noHp || matched?.noHp || "",
                avatarUrl:
                  existingUserInFirestore?.avatarUrl ||
                  matched?.avatarUrl ||
                  "",
              };
              setUsers((prev) => [...prev, finalUser]);
              setCurrentUser(finalUser);
              localStorage.setItem(
                "magika_offline_user",
                JSON.stringify(finalUser),
              );
              setCurrentView("dashboard");
              return;
            }
          }
        }
      }
      throw err;
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const credential = await signInWithPopup(auth, provider);
      const uid = credential.user.uid;
      const email = credential.user.email || "";
      const name =
        credential.user.displayName || email.split("@")[0] || "User Google";

      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);
      let userData: User;

      if (!docSnap.exists()) {
        const newUser: User = {
          id: uid,
          email: email,
          namaLengkap: name,
          role: "student", // 'student' is the internal role code used in MAGIKA for 'pendaftar'
          noHp: "",
        };
        await setDoc(userDocRef, newUser);
        userData = newUser;
      } else {
        userData = docSnap.data() as User;
      }

      setCurrentUser(userData);
      setCurrentView("dashboard");
    } catch (err: any) {
      if (
        err.code === "auth/network-request-failed" ||
        err.message?.includes("network-request-failed") ||
        err.message?.includes("network") ||
        err.message?.includes("offline") ||
        err.code === "auth/popup-blocked"
      ) {
        setIsOfflineMode(true);
        localStorage.setItem("magika_is_offline", "true");
        const studentUser = users.find((u) => u.role === "student");
        if (studentUser) {
          setCurrentUser(studentUser);
          localStorage.setItem(
            "magika_offline_user",
            JSON.stringify(studentUser),
          );
          setCurrentView("dashboard");
        }
        return;
      }
      throw err;
    }
  };

  const handleRegisterWithEmail = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.toLowerCase().trim(),
        password,
      );
      const uid = credential.user.uid;

      const newUser: User = {
        id: uid,
        email: email.toLowerCase().trim(),
        namaLengkap: name.trim(),
        role: "student",
      };

      await setDoc(doc(db, "users", uid), newUser);
      setCurrentUser(newUser);
      setCurrentView("dashboard");
    } catch (err: any) {
      if (
        err.code === "auth/network-request-failed" ||
        err.message?.includes("network-request-failed") ||
        err.message?.includes("network") ||
        err.message?.includes("offline")
      ) {
        setIsOfflineMode(true);
        localStorage.setItem("magika_is_offline", "true");
        const newUid = `mock-uid-registered-${Date.now()}`;
        const newUser: User = {
          id: newUid,
          email: email.toLowerCase().trim(),
          namaLengkap: name.trim(),
          role: "student",
        };
        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        localStorage.setItem("magika_offline_user", JSON.stringify(newUser));
        setCurrentView("dashboard");
        return;
      }
      throw err;
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const uid = credential.user.uid;
      const email = credential.user.email || "";
      const name = credential.user.displayName || email.split("@")[0];
      const avatarUrl = credential.user.photoURL || "";

      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data() as User;
        setCurrentUser(userData);
        setCurrentView("dashboard");
      } else {
        const newUser: User = {
          id: uid,
          email: email,
          namaLengkap: name,
          role: "student",
          avatarUrl: avatarUrl,
        };
        await setDoc(doc(db, "users", uid), newUser);
        setCurrentUser(newUser);
        setCurrentView("dashboard");
      }
    } catch (err: any) {
      if (
        err.code === "auth/network-request-failed" ||
        err.message?.includes("network-request-failed") ||
        err.message?.includes("network") ||
        err.message?.includes("offline") ||
        err.code === "auth/popup-blocked"
      ) {
        setIsOfflineMode(true);
        localStorage.setItem("magika_is_offline", "true");
        const studentUser = users.find((u) => u.role === "student");
        if (studentUser) {
          setCurrentUser(studentUser);
          localStorage.setItem(
            "magika_offline_user",
            JSON.stringify(studentUser),
          );
          setCurrentView("dashboard");
        }
        return;
      }
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      if (!isOfflineMode) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Firebase signOut failed:", err);
    }
    setCurrentUser(null);
    localStorage.removeItem("magika_offline_user");
    localStorage.removeItem("magika_is_offline");
    setIsOfflineMode(false);
    setCurrentView("landing");
  };

  const handleNewApplication = async (newApp: Application) => {
    // Pastikan semua field terdefinisi dengan benar sehingga tidak ada nilai undefined yang dikirim ke Firestore.
    const sanitizedApp: Application = {
      ...newApp,
      instansiPendidikan: newApp.instansiPendidikan || newApp.universitas || "",
    };
    if (sanitizedApp.kategoriPendaftar === "siswa") {
      sanitizedApp.nim = "";
      sanitizedApp.nisn = sanitizedApp.nisn || "";
      sanitizedApp.kelas = sanitizedApp.kelas || "";
      sanitizedApp.jurusan = sanitizedApp.jurusan || "";
    } else {
      sanitizedApp.nisn = "";
      sanitizedApp.nim = sanitizedApp.nim || "";
      sanitizedApp.fakultas = sanitizedApp.fakultas || "";
      sanitizedApp.prodi = sanitizedApp.prodi || "";
      sanitizedApp.semester = sanitizedApp.semester || "";
    }

    // Ganti semua nilai undefined secara rekursif dengan string kosong agar sesuai dengan aturan Firestore.
    const removeUndefined = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map((item) => removeUndefined(item));
      } else if (obj !== null && typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
          if (obj[key] !== undefined) {
            newObj[key] = removeUndefined(obj[key]);
          } else {
            newObj[key] = ""; // Default aman untuk Firestore agar field tidak kosong/undefined.
          }
        }
        return newObj;
      }
      return obj;
    };

    const finalApp = removeUndefined(sanitizedApp);
    const finalAppForFirestore = {
      ...finalApp,
      instansiPendidikan:
        finalApp.instansiPendidikan || finalApp.universitas || "",
    };

    // Data baru wajib memakai field instansiPendidikan, sementara data lama tetap dibiarkan.
    delete finalAppForFirestore.universitas;

    // Perbarui state aplikasi secara optimistis untuk memberi respons UI instan sebelum data disimpan ke Firestore.
    setApplications((prev) => {
      const exists = prev.some((a) => a.id === finalAppForFirestore.id);
      if (exists) {
        return prev.map((a) =>
          a.id === finalAppForFirestore.id ? finalAppForFirestore : a,
        );
      }
      return [finalAppForFirestore, ...prev];
    });

    if (currentUser && currentUser.role === "student") {
      const updatedUser = {
        ...currentUser,
        instansiPendidikan:
          finalAppForFirestore.instansiPendidikan ||
          currentUser.instansiPendidikan ||
          currentUser.universitas ||
          "",
        prodi: finalAppForFirestore.prodi,
        noHp: finalAppForFirestore.noHp,
      };
      await handleUpdateUser(updatedUser);
    }

    if (isOfflineMode) {
      return;
    }

    try {
      await setDoc(
        doc(db, "pendaftar_magang", finalAppForFirestore.id),
        finalAppForFirestore,
      );
    } catch (err) {
      console.error("Error creating application in Firestore:", err);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: ApplicationStatus,
    noteOrReason: string,
  ) => {
    try {
      const appDoc = applications.find((a) => a.id === id);
      if (appDoc) {
        const updated = { ...appDoc, status };
        if (status === "Lulus") {
          updated.statusNote = noteOrReason || "";
          updated.rejectionReason = "";
        } else if (status === "Ditolak") {
          updated.rejectionReason = noteOrReason || "";
          updated.statusNote = "";
        } else {
          updated.statusNote = noteOrReason || "";
          updated.rejectionReason = "";
        }

        // Bersihkan lagi semua field undefined pada objek final sebelum disimpan ke Firestore.
        const removeUndefined = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map((item) => removeUndefined(item));
          } else if (obj !== null && typeof obj === "object") {
            const newObj: any = {};
            for (const key in obj) {
              if (obj[key] !== undefined) {
                newObj[key] = removeUndefined(obj[key]);
              } else {
                newObj[key] = "";
              }
            }
            return newObj;
          }
          return obj;
        };

        const cleanedUpdated = removeUndefined(updated);
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? cleanedUpdated : a)),
        );

        if (isOfflineMode) {
          return;
        }

        await setDoc(doc(db, "pendaftar_magang", id), cleanedUpdated);
      }
    } catch (err) {
      console.error("Error updating status in Firestore:", err);
    }
  };

  const handleUpdateApplication = async (updatedApp: Application) => {
    try {
      const removeUndefined = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map((item) => removeUndefined(item));
        } else if (obj !== null && typeof obj === "object") {
          const newObj: any = {};
          for (const key in obj) {
            if (obj[key] !== undefined) {
              newObj[key] = removeUndefined(obj[key]);
            } else {
              newObj[key] = "";
            }
          }
          return newObj;
        }
        return obj;
      };
      const cleanedApp = removeUndefined(updatedApp);
      setApplications((prev) =>
        prev.map((a) => (a.id === cleanedApp.id ? cleanedApp : a)),
      );

      if (isOfflineMode) {
        return;
      }

      await setDoc(doc(db, "pendaftar_magang", cleanedApp.id), cleanedApp);
    } catch (err) {
      console.error("Error updating application in Firestore:", err);
    }
  };

  const handleAdminDeleteApplication = async (id: string) => {
    try {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (isOfflineMode) {
        return;
      }
      await deleteDoc(doc(db, "pendaftar_magang", id));
    } catch (err) {
      console.error("Error deleting application from Firestore:", err);
    }
  };

  const handleCreateSurat = async (payload: any) => {
    try {
      if (isOfflineMode) {
        const mockId = `surat-mock-${Date.now()}`;
        const mockSurat = {
          ...payload,
          id: mockId,
          createdAt: new Date().toISOString(),
        };
        setSuratList((prev) => [mockSurat, ...prev]);
        return;
      }
      const docRef = await addDoc(collection(db, "surat"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);

      // Sinkronkan data surat lokal juga agar pengguna langsung melihat perubahan tanpa menunggu reload.
      const freshSurat = {
        ...payload,
        id: docRef.id,
        createdAt: new Date().toISOString(),
      };
      setSuratList((prev) => [freshSurat, ...prev]);
    } catch (err) {
      console.error("Error creating letter in Firestore:", err);
      throw err;
    }
  };

  const handleDeleteSurat = async (id: string) => {
    try {
      setSuratList((prev) => prev.filter((s) => s.id !== id));
      if (isOfflineMode) {
        return;
      }
      await deleteDoc(doc(db, "surat", id));
    } catch (err) {
      console.error("Error deleting letter from Firestore:", err);
    }
  };

  const handleDeleteApplication = async () => {
    if (!currentUser) return;
    try {
      const studentApp = applications.find(
        (app) =>
          app.userEmail.toLowerCase() === currentUser.email.toLowerCase(),
      );
      if (studentApp) {
        setApplications((prev) =>
          prev.filter((app) => app.id !== studentApp.id),
        );
        if (isOfflineMode) {
          return;
        }
        await deleteDoc(doc(db, "pendaftar_magang", studentApp.id));
      }
    } catch (err) {
      console.error("Error deleting student application:", err);
    }
  };

  const handleSetWhatsappLink = async (link: string) => {
    setWhatsappLink(link);
    if (isOfflineMode) {
      return;
    }
    try {
      await setDoc(
        doc(db, "settings", "config"),
        { whatsappLink: link },
        { merge: true },
      );
    } catch (err) {
      console.error("Error setting whatsapp link in settings:", err);
    }
  };

  // Cari data aplikasi magang milik siswa yang sedang login.
  const getStudentApplication = (): Application | null => {
    if (!currentUser || currentUser.role !== "student") return null;
    const studentEmail = currentUser.email?.toLowerCase().trim() || "";
    return (
      applications.find(
        (app) => (app.userEmail || "").toLowerCase().trim() === studentEmail,
      ) || null
    );
  };

  // Cari aplikasi berdasarkan ID pelacakan yang dimasukkan pengguna di halaman track.
  const trackedApp = applications.find((app) => app.id === trackedAppId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans" id="app-root">
      <AnimatePresence mode="wait">
        {/* 1. Landing View */}
        {currentView === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <LandingPage
              onNavigate={(view) => {
                if (view === "login") {
                  setCurrentView("login");
                } else if (view === "register") {
                  setCurrentView("register");
                } else if (view === "track") {
                  setTrackedAppId(null);
                  setCurrentView("track");
                }
              }}
              applications={applications}
            />
          </motion.div>
        )}

        {/* 2. Login View */}
        {currentView === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <AuthPages
              initialView="login"
              onNavigateHome={() => setCurrentView("landing")}
              onLoginWithEmail={handleLoginWithEmail}
              onLoginWithGoogle={handleLoginWithGoogle}
              onRegisterWithEmail={handleRegisterWithEmail}
              onRegisterWithGoogle={handleRegisterWithGoogle}
            />
          </motion.div>
        )}

        {/* 3. Register View */}
        {currentView === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <AuthPages
              initialView="register"
              onNavigateHome={() => setCurrentView("landing")}
              onLoginWithEmail={handleLoginWithEmail}
              onLoginWithGoogle={handleLoginWithGoogle}
              onRegisterWithEmail={handleRegisterWithEmail}
              onRegisterWithGoogle={handleRegisterWithGoogle}
            />
          </motion.div>
        )}

        {/* 4. Multi-step Registration Form View */}
        {currentView === "form" && currentUser && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <FormPage
              currentUser={currentUser}
              onNavigateDashboard={() => setCurrentView("dashboard")}
              onSubmitSuccess={(newApp) => {
                handleNewApplication(newApp);
                setCurrentView("dashboard");
              }}
            />
          </motion.div>
        )}

        {/* 5. Dashboards depending on Role */}
        {currentView === "dashboard" && currentUser && (
          <motion.div
            key={`dashboard-${currentUser.role}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {currentUser.role === "student" && (
              <StudentDashboard
                currentUser={currentUser}
                application={getStudentApplication()}
                onNavigateForm={() => setCurrentView("form")}
                onLogout={handleLogout}
                onDeleteApplication={handleDeleteApplication}
                whatsappLink={whatsappLink}
                onUpdateApplication={handleUpdateApplication}
                onUpdateUser={handleUpdateUser}
                suratList={suratList}
              />
            )}

            {currentUser.role === "admin" && (
              <AdminDashboard
                currentUser={currentUser}
                users={users}
                applications={applications}
                onUpdateStatus={handleUpdateStatus}
                onUpdateApplication={handleUpdateApplication}
                onCreateApplication={handleNewApplication}
                onDeleteApplication={handleAdminDeleteApplication}
                whatsappLink={whatsappLink}
                setWhatsappLink={handleSetWhatsappLink}
                onLogout={handleLogout}
                suratList={suratList}
                onCreateSurat={handleCreateSurat}
                onDeleteSurat={handleDeleteSurat}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {currentUser.role === "camat" && (
              <CamatDashboard
                applications={applications}
                currentUser={currentUser}
                onLogout={handleLogout}
                onUpdateApplication={handleUpdateApplication}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </motion.div>
        )}

        {/* 6. Dedicated Application Status Tracking View */}
        {currentView === "track" && (
          <motion.div
            key="track"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <TrackPage
              applications={applications}
              onNavigateHome={() => {
                setCurrentView("landing");
                setTrackedAppId(null);
              }}
              initialSearchId={trackedAppId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isOfflineMode && (
        <div className="fixed bottom-4 right-4 z-50 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-pulse">
          <AlertTriangle
            className="h-4 w-4 text-amber-500 shrink-0"
            id="offline-alert-icon"
          />
          <span>Mode Offline (Local Fallback Aktif)</span>
          <button
            id="offline-reconnect-btn"
            onClick={() => {
              setIsOfflineMode(false);
              localStorage.removeItem("magika_is_offline");
              window.location.reload();
            }}
            className="ml-2 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors text-[10px]"
          >
            Hubungkan Ulang
          </button>
        </div>
      )}
    </div>
  );
}
