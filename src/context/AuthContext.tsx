
import {
  createContext,
  useContext,
  useState,
  useEffect,
 useCallback,
  type ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  type User,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<User>;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("melooha_user");
    const token = localStorage.getItem("melooha_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        logoutUser();
      }
    }

    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const response = await loginUser({ email, password });

    setUser(response.user);
    return response.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    await registerUser({ name, email, password });
    return login(email, password);
  };

 const updateUser = useCallback((updates: Partial<User>) => {
    setUser((currentUser) => {
        if (!currentUser) return currentUser;

        const updatedUser = {
            ...currentUser,
            ...updates,
        };

        localStorage.setItem(
            "melooha_user",
            JSON.stringify(updatedUser)
        );

        return updatedUser;
    });
}, []);

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
