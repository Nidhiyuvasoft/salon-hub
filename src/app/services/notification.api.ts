import { showToast } from "../components/ui/toast";
import api from "./axios";

export const notificationApi = {
    getAllNotifications: async()=> {
        try{
            const res= await api.get('/appointment/notifications');
            return res.data;
        }
        catch(error: any){
            showToast({
                message: error?.response?.message || "Failed to Fetch Notifications",
                status: "error"
            })
        }
    }
}