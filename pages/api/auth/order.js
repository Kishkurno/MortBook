import { getOrdersByUserId, deleteOrder, getAllOrders, addOrder, getOrdersByUserIdAndBookId, getUserById, searchUserBook } from "@/db/dbOperations";
const jwt = require('jsonwebtoken');

const Orders = async (req, res) => {

  if (req.method == "GET") {
    try {

      const authHeader = req.headers["authorization"];

      const accessToken = authHeader.split(" ")[1];

      const decodedToken = jwt.decode(accessToken);

      const { userId } = decodedToken;
      const [userData] = await getUserById(userId);
      let orders
      if (userData.roleName == "Admin") {
        console.log(userData.roleName)
        orders = await getAllOrders();
        return res.status(200).json(orders);
      }

      orders = await getOrdersByUserId(userId);
      return res.status(200).json(orders);
    } catch (err) {
      console.log(err)
      return res.status(500).json({ err: err.message });
    }
  }

  if (req.method == "POST") {
    try {
      const { bookId } = req.body
      const authHeader = req.headers["authorization"];

      const accessToken = authHeader.split(" ")[1];

      const decodedToken = jwt.decode(accessToken);

      const { userId } = decodedToken;

      const orders = await getOrdersByUserIdAndBookId(userId, bookId);
      const book = await searchUserBook(userId, bookId);
      if (book.length) {
        return res.status(500).json({ message: 'You already have this books' });
      }
      if (orders.length) {
        return res.status(500).json({ message: 'This book already ordered' });
      }
      await addOrder(userId, bookId);

      return res.status(200).json();
    } catch (err) {
      console.log(err)
      return res.status(500).json({ err: err.message });
    }
  }

  if (req.method == "PATCH") {

    try {

      const { orderId } = req.body
      const authHeader = req.headers["authorization"];

      const accessToken = authHeader.split(" ")[1];

      const decodedToken = jwt.decode(accessToken);

      const { userId } = decodedToken;

      await deleteOrder(orderId);

      return res.status(200).json();
    } catch (err) {
      console.log(err)
      return res.status(500).json({ err: err.message });
    }
  }
};
export default Orders;