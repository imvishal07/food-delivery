import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

export const getDashboardStats = async (req,res)=>{

 try{

  const orders = await orderModel.find({})

  const totalRevenue = orders.reduce((sum,order)=> sum + order.amount ,0)

  const totalOrders = orders.length

  const totalUsers = await userModel.countDocuments()

  const totalProducts = await foodModel.countDocuments()

  let todaySales = 0
  let weekSales = 0
  let monthSales = 0

  const now = new Date()
orders.forEach(order => {

  const orderDate = new Date(order.createdAt);

  const now = new Date();
  const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    todaySales += order.amount;
  }

  if (diffDays < 7) {
    weekSales += order.amount;
  }

  if (diffDays < 30) {
    monthSales += order.amount;
  }

});

  res.json({
   success:true,
   data:{
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    todaySales,
    weekSales,
    monthSales
   }
  })

 }catch(error){
  res.json({success:false,message:error.message})
 }

}