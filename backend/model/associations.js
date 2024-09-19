import History from './History.js';
import Card from './Card.js';
import User from './User.js';
import Parchi from './Parchi.js';

// Set up associations here
User.hasMany(Parchi, { foreignKey: 'user_id' });



Parchi.belongsTo(User, { foreignKey: 'user_id'});


Card.hasMany(History, { foreignKey: 'card_id' });




History.belongsTo(Card, { foreignKey: 'card_id' });

export default { History, Card };
