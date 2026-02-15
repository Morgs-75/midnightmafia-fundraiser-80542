import { useState, useEffect } from 'react';
import { supabase, BOARD_ID } from './supabase';
import { NumberData } from '../app/types';

export function useNumbers() {
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load numbers from Supabase
  const loadNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('numbers')
        .select('number, status, display_name, message, promo_code')
        .eq('board_id', BOARD_ID)
        .order('number', { ascending: true });

      if (error) throw error;

      // Transform to match UI expectations
      const transformedNumbers: NumberData[] = (data || []).map((n) => ({
        number: n.number,
        status: n.status as 'available' | 'held' | 'sold',
        displayName: n.display_name || undefined,
        message: n.message || undefined,
        isTeamNumber: n.promo_code === 'OUTLAWS', // Team numbers have OUTLAWS promo code
      }));

      setNumbers(transformedNumbers);
      setLoading(false);
    } catch (err) {
      console.error('Error loading numbers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load numbers');
      setLoading(false);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    loadNumbers();

    const channel = supabase
      .channel('numbers-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'numbers',
          filter: `board_id=eq.${BOARD_ID}`,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          loadNumbers(); // Reload all numbers on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { numbers, loading, error, reload: loadNumbers };
}
