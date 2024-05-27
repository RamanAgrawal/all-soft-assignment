import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserData = {
  token: string;
  user_id: string;
};
export interface UserContextProps {
  userdata: UserData | null;
  setUserdata: Dispatch<SetStateAction<UserData | null>>;
}

export const UserContext = createContext<UserContextProps >(
    {
        userdata: null,
        setUserdata: () => {},
    }
);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userdata, setUserdata] = useState<UserData | null>(null);

  useEffect(()=>{
    setUserdata(JSON.parse(localStorage.getItem('data') as string))
  },[])
  return (
    <UserContext.Provider value={{ userdata, setUserdata }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}