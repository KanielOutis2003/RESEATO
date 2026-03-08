// frontend/src/services/paymentService.ts
import { supabase } from '../config/supabase'

class PaymentService {
  async createPayment(reservationId: string, amount: number, paymentMethod: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          reservation_id: reservationId,
          amount,
          payment_method: paymentMethod,
          payment_status: 'completed' // In a real app, this would be 'pending' until the gateway confirms
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error: any) {
      console.error('Error in createPayment:', error);
      throw new Error(error.message);
    }
  }

  async getPayment(reservationId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('reservation_id', reservationId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } catch (error: any) {
      console.error('Error in getPayment:', error);
      return null;
    }
  }
}

export default new PaymentService();
