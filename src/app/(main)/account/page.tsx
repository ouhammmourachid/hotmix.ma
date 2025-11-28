"use client"
import React,{useState,useEffect} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UpdateProfile from './update-profile';
import { Button } from '@/components/ui/button';
// import AddAddress from './add-address';
import { Pencil,Plus } from 'lucide-react';
import { useApiService } from "@/services/api.service";
import User from "@/types/user";

export default function ProfilePage(){
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const api = useApiService()
  const [user, setUser] = useState<User | null>(null)
  const getAccountInfo = async () => {
    try {
      const response = await api.auth.info();
      setUser(response.data);
      } catch (err ) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log(err);
        }
      }
  }
  useEffect(() => {
    getAccountInfo();
  }, []);
  const handleClickPensil = () => {
    setIsModalInfoOpen(!isModalInfoOpen);
    setIsModalAddressOpen(false);
  }
  const handleClickAdress = () => {
    setIsModalAddressOpen(!isModalAddressOpen);
    setIsModalInfoOpen(false);
  }
  return (
    <div className="min-h-screen p-8 space-y-8 px-44">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <Card className="bg-secondary border-none shadow-lg">
        <CardContent className="p-6">
          {/* Name Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-gray-300">Name</label>
              <Button
                onClick={handleClickPensil}
                variant="ghost"
                size="icon"
                className="text-greny hover:text-greny/70">
                <Pencil size={16} />
              </Button>
            </div>
          </div>
          {/* Email Section */}
          <div className="mb-6">
            <label className="block text-gray-300">Email</label>
            <span className="text-gray-300">{user?.email}</span>
          </div>
        </CardContent>
      </Card>
      {/* <Card className="bg-secondary border-none shadow-lg">
        <CardContent className="p-6">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-gray-300">Addresses</label>
              <button
                onClick={handleClickAdress}
                className="flex items-center gap-1 text-lime-400 hover:text-lime-300">
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300">
                  <span className="text-gray-400">i</span>
                </div>
                No addresses added
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
      <UpdateProfile
        isOpen={isModalInfoOpen}
        onClose={handleClickPensil}/>
      {/* <AddAddress
        isOpen={isModalAddressOpen}
        onClose={handleClickAdress}/> */}
    </div>
  );
}
