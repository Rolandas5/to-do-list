// Įsikeliu jsonwebtoken biblioteką, kad galėčiau tikrinti ir iššifruoti JWT tokenus
const jwt = require('jsonwebtoken');

// Įsikeliu util modulį, nes noriu paversti callback funkcijas į pažadus (Promise)
const util = require('util');

// naudoju util.promisify tam, kad jwt.verify būtų galima naudoti su await
const verifyToken = util.promisify(jwt.verify);

// Sukuriu middleware funkciją, kuri tikrins ar vartotojas turi galiojantį JWT tokeną
const authMiddleware = async (req, res, next) => {
  // paimu Authorization antraštę iš vartotojo užklausos
  const authHeader = req.headers.authorization;

  // patikrinu: jei Authorization nėra arba neprasideda "Bearer ", iškart atmetu su 401 klaida
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // išskiriu tikrąjį tokeną: pašalinu "Bearer" žodį ir palieku tik tokeno reikšmę
  const token = authHeader.split(' ')[1];

  try {
    // patikrinu ar tokenas yra galiojantis ir jį iškoduodamas gaunu vartotojo informaciją
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    // įrašau iškoduotą vartotojo ID į req objektą, kad galėčiau jį naudoti toliau
    req.user = { id: decoded.id };

    // Kadangi viskas gerai, aš leidžiu eiti į sekantį middleware ar į galutinį route
    next();
  } catch (error) {
    // Jei tokenas blogas arba baigėsi galiojimas, aš grąžinu 401 klaidą (Unauthorized)
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// eksportuoju authMiddleware, kad galėčiau naudoti kituose failuose
module.exports = authMiddleware;
