'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutState {
  customerInfo: CustomerInfo | null;
  orderId: string | null;
  orderTotal: number | null;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }> | null;
  isLoading: boolean;
}

type CheckoutAction =
  | { type: 'SET_CHECKOUT_DATA'; payload: { customerInfo: CustomerInfo; orderTotal: number; orderItems: Array<{ name: string; quantity: number; price: number }> } }
  | { type: 'SET_ORDER_ID'; payload: string }
  | { type: 'CLEAR_CHECKOUT_DATA' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CheckoutState = {
  customerInfo: null,
  orderId: null,
  orderTotal: null,
  orderItems: null,
  isLoading: true,
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  console.log('CheckoutContext: Reducer called with action:', action.type, action);
  
  switch (action.type) {
    case 'SET_CHECKOUT_DATA':
      console.log('CheckoutContext: Setting checkout data, new state:', {
        ...state,
        customerInfo: action.payload.customerInfo,
        orderTotal: action.payload.orderTotal,
        orderItems: action.payload.orderItems,
      });
      return {
        ...state,
        customerInfo: action.payload.customerInfo,
        orderTotal: action.payload.orderTotal,
        orderItems: action.payload.orderItems,
      };
    case 'SET_ORDER_ID':
      console.log('CheckoutContext: Setting order ID:', action.payload);
      return {
        ...state,
        orderId: action.payload,
      };
    case 'CLEAR_CHECKOUT_DATA':
      console.log('CheckoutContext: Clearing checkout data');
      return initialState;
    case 'SET_LOADING':
      console.log('CheckoutContext: Setting loading state:', action.payload);
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

interface CheckoutContextType {
  state: CheckoutState;
  setCheckoutData: (customerInfo: CustomerInfo, orderTotal: number, orderItems: Array<{ name: string; quantity: number; price: number }>) => void;
  setOrderId: (orderId: string) => void;
  clearCheckoutData: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  // Load checkout data from localStorage on mount
  useEffect(() => {
    console.log('CheckoutContext: Loading data from localStorage...');
    const savedCheckoutData = localStorage.getItem('checkoutData');
    console.log('CheckoutContext: Saved data:', savedCheckoutData);
    
    if (savedCheckoutData) {
      try {
        const parsed = JSON.parse(savedCheckoutData);
        console.log('CheckoutContext: Parsed data:', parsed);
        
        if (parsed.customerInfo && parsed.orderTotal && parsed.orderItems) {
          console.log('CheckoutContext: Dispatching SET_CHECKOUT_DATA');
          dispatch({ type: 'SET_CHECKOUT_DATA', payload: parsed });
        } else {
          console.log('CheckoutContext: Missing required fields in parsed data');
        }
      } catch (error) {
        console.error('CheckoutContext: Failed to parse saved checkout data:', error);
      }
    } else {
      console.log('CheckoutContext: No saved data found');
    }
    
    // Set loading to false after attempting to load data
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Save checkout data to localStorage whenever it changes
  useEffect(() => {
    if (state.customerInfo && state.orderTotal && state.orderItems) {
      localStorage.setItem('checkoutData', JSON.stringify({
        customerInfo: state.customerInfo,
        orderTotal: state.orderTotal,
        orderItems: state.orderItems,
      }));
    }
  }, [state.customerInfo, state.orderTotal, state.orderItems]);

  const setCheckoutData = (customerInfo: CustomerInfo, orderTotal: number, orderItems: Array<{ name: string; quantity: number; price: number }>) => {
    console.log('CheckoutContext: setCheckoutData called with:', { customerInfo, orderTotal, orderItems });
    dispatch({ type: 'SET_CHECKOUT_DATA', payload: { customerInfo, orderTotal, orderItems } });
  };

  const setOrderId = (orderId: string) => {
    dispatch({ type: 'SET_ORDER_ID', payload: orderId });
  };

  const clearCheckoutData = () => {
    dispatch({ type: 'CLEAR_CHECKOUT_DATA' });
    localStorage.removeItem('checkoutData');
  };

  const value: CheckoutContextType = {
    state,
    setCheckoutData,
    setOrderId,
    clearCheckoutData,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}; 