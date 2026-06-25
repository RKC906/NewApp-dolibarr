import { api } from "./api";
import type { product } from "@/interfaces/product";

export const productService = 
{
    async getAll(): Promise<product[]> 
    {
    const response = await api.get<product[]>('/products')
    return response.data
  }
}