import axios from './axios.js';

export const handleParchiTransaction = async (parchi, userId) => {
  try {
    // Step 1: save Da parchi;
    const parchiResponse = await axios.post(`/api/parchi`, { 
        cards: parchi.cards,
        total: parchi.total,
        user_id: userId 
    });
    console.log('Parchi made', parchiResponse.data);
    const currentParchi = parchiResponse.data.parchi;

    // Step 2: Create a Daybill entry
    const daybillResponse = await axios.post('/api/daybill', {
      user_id: userId,
      sales: currentParchi.total,
      qty: currentParchi.totalQty,
      expenditure: 0 // Adjust as necessary
    });
    console.log('Daybill created:', daybillResponse.data);

    // Step 3: Update BuyRate if necessary
    const buyRateResponse = await axios.post('/api/buyrate', {
      cards: currentParchi.cards
    });
    console.log('BuyRate updated:', buyRateResponse.data);

    // Step 4: Update User points and sales send userid and currentParchi.total
    const salesResponse = await axios.post(`/api/user/${userId}/sales`, {
        total: currentParchi.total,
    });
    console.log('BuyRate updated:', salesResponse.data);
    
    // Step 5: Create a transaction record
    const transactionResponse = await axios.post('/api/transaction', {
      userId: userId,
      amount: currentParchi.total,
      type: 'sub'
    });
    console.log('Transaction recorded:', transactionResponse.data);

    return {
      success: true,
      messages: [
        'Parchi cashed out successfully',
        'Daybill created successfully',
        'BuyRate updated successfully',
        'Transaction recorded successfully'
      ]
    };
  } catch (error) {
    console.error('Error during transaction:', error);
    return {
      success: false,
      error: error.response ? error.response.data : 'Internal Server Error'
    };
  }
};
