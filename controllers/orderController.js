import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";

// export const createOrderController = async (req, res) => {
//     try {
//         const {
//             shippingInfo,
//             orderItems,
//             paymentMethod,
//             paymentInfo,
//             itemPrice,
//             tax,
//             shippingCharges,
//             totalAmount,
//             orderStatus,
//         } = req.body;

//         // if (
//         //     !shippingInfo ||
//         //     !orderItems ||
//         //     !paymentMethod ||
//         //     !paymentInfo ||
//         //     !itemPrice ||
//         //     !tax ||
//         //     !shippingCharges ||
//         //     !totalAmount ||
//         //     !orderStatus
//         // ) {
//         //     return res.status(404).send({
//         //         success: false,
//         //         message: "Please Fill In All Fields",
//         //     });
//         // }

// ////////////////////////

// // Check if shippingInfo is falsy
// if (!shippingInfo) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide shipping information",
//     });
// }

// // Check if orderItems is falsy
// if (!orderItems) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide order items",
//     });
// }

// // Check if paymentMethod is falsy
// if (!paymentMethod) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide payment method",
//     });
// }

// // Check if paymentInfo is falsy
// if (!paymentInfo) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide payment information",
//     });
// }

// // Check if itemPrice is falsy
// if (!itemPrice) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide item price",
//     });
// }

// // Check if tax is falsy
// if (!tax) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide tax information",
//     });
// }

// // Check if shippingCharges is falsy
// if (!shippingCharges) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide shipping charges",
//     });
// }

// // Check if totalAmount is falsy
// if (!totalAmount) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide total amount",
//     });
// }

// // Check if orderStatus is falsy
// if (!orderStatus) {
//     return res.status(404).send({
//         success: false,
//         message: "Please provide order status",
//     });
// }

// ///////////////////////

//         await orderModel.create({
//             user: req.user._id,
//             shippingInfo,
//             orderItems,
//             paymentMethod,
//             paymentInfo,
//             itemPrice,
//             tax,
//             shippingCharges,
//             totalAmount,
//             orderStatus,
//         });

//         //StockUpdate
//         for(let i=0;i<orderItems.length;i++){
//             const product=await productModel.findById(orderItems[i].product)
//             product.stock-=orderItems[i].quantity
//             await product.save()
//         }

//         res.status(201).send({
//             success: true,
//             message: "Order Placed Successfully",
//         });

//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: "ERROR IN Create Order  API",
//         });
//     }
// };

// CREATE ORDERS
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    //valdiation
    // create order
    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Order API",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const order = await orderModel.find({ user: req.user._id }); //find orders on the basis of user's id
    if (!order) {
      res.status(404).send({
        success: false,
        message: "Cannot find Order",
      });
    }
    res.status(200).send({
      success: true,
      message: "Order data",
      totalOrders: order.length,
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Get ALL Orders API",
      error,
    });
  }
};

export const getSingleOrderInfo = async (req, res) => {
  try {
    //Get Orders

    const order = await orderModel.findById(req.params.id); //find order by specific order's id
    if (!order) {
      res.status(404).send({
        success: false,
        message: "Cannot find Your Order",
      });
    }
    res.status(200).send({
      success: true,
      message: "Order data",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Get SINGLE Orders API",
      error,
    });
  }
};

//ACCEPT PAYMENT

export const paymentController = async (req, res) => {
  try {
    //Get Amount from user
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is Required",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In PAYMENT API",
      error,
    });
  }
};

//=========ADMIN SECTION=============//

export const getAllOrdersController_Admin = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All Orders Data",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In GetAllOrderController_Admin API",
      error,
    });
  }
};

//CHNAGE ORDER STATUS
export const changeOrderStatusController = async (req, res) => {
  try {
    //Find Order
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "delivered";
      order.deliverdAt = Date.now();//when the order status is "delivered" then then we add curent date in the database at which the order is delivered
    } else {
      return res.status(500).send({
        success: false,
        message: "Order Already Delivered",
        
      });
    }
    await order.save();

    res.status(200).send({
        success: true,
        message: "Order Status Updated",
        
      });


  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In ChangeOrderStatus API",
      error,
    });
  }
};
