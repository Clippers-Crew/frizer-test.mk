import { Salon } from '../interfaces/Salon.interface';
import axios from './config/axios';

const SalonService = {
    getSalons: () => {
        return axios.get<Salon[]>("/salons");
    },
    getSalon: (id: number) => {
        return axios.get<Salon>(`/salons/${id}`);
    },
    getSalonsByIds: (ids: number[]) => {
        const params = new URLSearchParams();
        ids.forEach(id => params.append('ids', id.toString()));
        
        return axios.get<Salon[]>('/salons/ids', { params });
      },
  getTopNSalons: (n: number) => {
        return axios.get<Salon[]>(`/salons/top?count=${n}`);
    },
    searchSalons: (queryParams: string) => {
        return axios.get<Salon[]>(`/salons?${queryParams}`);
    }
};
    
export default SalonService;

