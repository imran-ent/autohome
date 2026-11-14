import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Order from "../models/Order.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // --- Seed Admin ---
    const adminEmail = process.env.ADMIN_EMAIL || "autohomebatteries@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";
    const adminName = process.env.ADMIN_NAME || "Mohammed Umer A";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        mobile: "9789688756",
        password: adminPassword,
        role: "admin",
      });
      console.log("Admin account created.");
    } else {
      console.log("Admin account already exists.");
    }

    // --- Seed Suppliers ---
    const supplierData = [
      {
        name: "Exide Industries Ltd",
        contact: "+91 9876543210",
        products: [
          {
            sku: "EX-FX400",
            wholesalePrice: 4500,
            available: true,
            leadTime: "2-3 days",
          },
          {
            sku: "EX-IT500",
            wholesalePrice: 6200,
            available: true,
            leadTime: "2-3 days",
          },
        ],
        isActive: true,
      },
      {
        name: "SF Sonic Batteries",
        contact: "+91 9876543211",
        products: [
          {
            sku: "SF-CR100",
            wholesalePrice: 3800,
            available: true,
            leadTime: "3-4 days",
          },
          {
            sku: "SF-IT600",
            wholesalePrice: 5500,
            available: true,
            leadTime: "3-4 days",
          },
        ],
        isActive: true,
      },
      {
        name: "Microtek Inverters",
        contact: "+91 9876543212",
        products: [
          {
            sku: "MT-UPS2450",
            wholesalePrice: 8500,
            available: true,
            leadTime: "1-2 days",
          },
          {
            sku: "MT-UPS1100",
            wholesalePrice: 5200,
            available: true,
            leadTime: "1-2 days",
          },
        ],
        isActive: true,
      },
      {
        name: "Amaron Battery",
        contact: "+91 9876543213",
        products: [
          {
            sku: "AM-FL550",
            wholesalePrice: 5100,
            available: true,
            leadTime: "2-3 days",
          },
        ],
        isActive: true,
      },
    ];

    for (const s of supplierData) {
      let existing = await Supplier.findOne({ name: s.name });
      if (!existing) {
        await Supplier.create(s);
        console.log(`Supplier created: ${s.name}`);
      }
    }

    // --- Seed Products ---
    const productData = [
      // Home Inverter Batteries
      {
        name: "Exide Inva Master FX400",
        brand: "Exide",
        sku: "EX-FX400",
        category: "Home Inverter Batteries",
        subCategory: "Tubular",
        ahCapacity: 40,
        voltage: 12,
        batteryType: "Tubular",
        warranty: "36 months",
        purchasePrice: 4500,
        sellingPrice: 6500,
        gstRate: 28,
        currentStock: 15,
        reservedStock: 0,
        minStockLevel: 5,
        supplierAvailable: true,
        supplierLeadTime: "2-3 days",
        description: "High-performance tubular battery for home inverter systems. Long life and low maintenance.",
        pros: ["Long backup time", "Low maintenance", "36 months warranty", "Trusted brand"],
        cons: ["Heavy weight", "Higher price"],
        images: ["https://images.unsplash.com/photo-1603697771687-0a94880281e3?w=400"],
        isActive: true,
        compatibleVehicles: [],
      },
      {
        name: "SF Sonic CR100",
        brand: "SF Sonic",
        sku: "SF-CR100",
        category: "Home Inverter Batteries",
        subCategory: "Flat Plate",
        ahCapacity: 100,
        voltage: 12,
        batteryType: "Flat Plate",
        warranty: "24 months",
        purchasePrice: 3800,
        sellingPrice: 5400,
        gstRate: 28,
        currentStock: 20,
        reservedStock: 0,
        minStockLevel: 5,
        supplierAvailable: true,
        supplierLeadTime: "3-4 days",
        description: "Reliable flat plate battery for home inverter use. Economical and durable.",
        pros: ["Affordable", "Good for small homes", "24 months warranty"],
        cons: ["Shorter warranty", "Lower cycle life"],
        images: ["https://images.unsplash.com/photo-1591870124873-6926895036e8?w=400"],
        isActive: true,
        compatibleVehicles: [],
      },
      {
        name: "Microtek UPS 2450",
        brand: "Microtek",
        sku: "MT-UPS2450",
        category: "Inverters",
        subCategory: "Sine Wave",
        ahCapacity: 0,
        voltage: 24,
        batteryType: "N/A",
        warranty: "24 months",
        purchasePrice: 8500,
        sellingPrice: 11500,
        gstRate: 28,
        currentStock: 8,
        reservedStock: 0,
        minStockLevel: 3,
        supplierAvailable: true,
        supplierLeadTime: "1-2 days",
        description: "Pure sine wave inverter for home and office use. Compatible with Exide and SF batteries.",
        pros: ["Pure sine wave", "Microtek compatibility", "Digital display"],
        cons: ["Higher price", "Battery sold separately"],
        images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"],
        isActive: true,
        compatibleVehicles: [],
      },
      // Car Batteries
      {
        name: "Exide FX400 Car Battery",
        brand: "Exide",
        sku: "EX-CAR400",
        category: "Car Batteries",
        subCategory: "SMF",
        ahCapacity: 40,
        voltage: 12,
        batteryType: "SMF",
        warranty: "24 months",
        purchasePrice: 4200,
        sellingPrice: 6000,
        gstRate: 28,
        currentStock: 12,
        reservedStock: 0,
        minStockLevel: 4,
        supplierAvailable: true,
        supplierLeadTime: "2-3 days",
        description: "Maintenance-free SMF car battery for Maruti Swift, Hyundai i10, Tata Tiago and similar hatchbacks.",
        pros: ["Maintenance-free", "Quick start", "24 months warranty"],
        cons: ["Not for SUVs", "Moderate capacity"],
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400"],
        isActive: true,
        compatibleVehicles: [
          { make: "Maruti", model: "Swift", yearFrom: 2015, yearTo: 2024 },
          { make: "Hyundai", model: "i10", yearFrom: 2014, yearTo: 2023 },
          { make: "Tata", model: "Tiago", yearFrom: 2016, yearTo: 2024 },
        ],
      },
      {
        name: "Amaron FL550 Car Battery",
        brand: "Amaron",
        sku: "AM-FL550",
        category: "Car Batteries",
        subCategory: "SMF",
        ahCapacity: 55,
        voltage: 12,
        batteryType: "SMF",
        warranty: "36 months",
        purchasePrice: 5100,
        sellingPrice: 7500,
        gstRate: 28,
        currentStock: 10,
        reservedStock: 0,
        minStockLevel: 4,
        supplierAvailable: true,
        supplierLeadTime: "2-3 days",
        description: "High-cranking SMF car battery for sedans and SUVs. Reliable starting in all weather.",
        pros: ["High cranking power", "36 months warranty", "All-weather reliable"],
        cons: ["Premium price"],
        images: ["https://images.unsplash.com/photo-1544717302-2564b92e1f8b?w=400"],
        isActive: true,
        compatibleVehicles: [
          { make: "Toyota", model: "Innova", yearFrom: 2016, yearTo: 2024 },
          { make: "Mahindra", model: "XUV500", yearFrom: 2015, yearTo: 2023 },
          { make: "Hyundai", model: "Creta", yearFrom: 2015, yearTo: 2024 },
        ],
      },
      // Bike Batteries
      {
        name: "Exide Bike Battery 12V 7Ah",
        brand: "Exide",
        sku: "EX-BIKE7",
        category: "Bike Batteries",
        subCategory: "SMF",
        ahCapacity: 7,
        voltage: 12,
        batteryType: "SMF",
        warranty: "12 months",
        purchasePrice: 1800,
        sellingPrice: 2600,
        gstRate: 28,
        currentStock: 25,
        reservedStock: 0,
        minStockLevel: 8,
        supplierAvailable: true,
        supplierLeadTime: "2-3 days",
        description: "Compact SMF battery for 100cc-150cc motorcycles and scooters.",
        pros: ["Compact size", "Easy installation", "Affordable"],
        cons: ["Lower capacity", "12 months warranty"],
        images: ["https://images.unsplash.com/photo-1558981806-ec027acee949?w=400"],
        isActive: true,
        compatibleVehicles: [
          { make: "Hero", model: "Splendor", yearFrom: 2015, yearTo: 2024 },
          { make: "Honda", model: "Activa", yearFrom: 2016, yearTo: 2024 },
          { make: "Bajaj", model: "Pulsar", yearFrom: 2016, yearTo: 2024 },
        ],
      },
      // Truck / Commercial
      {
        name: "Exide Truck Battery 100Ah",
        brand: "Exide",
        sku: "EX-TRUCK100",
        category: "Truck / Commercial Batteries",
        subCategory: "Tubular",
        ahCapacity: 100,
        voltage: 12,
        batteryType: "Tubular",
        warranty: "24 months",
        purchasePrice: 8500,
        sellingPrice: 12000,
        gstRate: 28,
        currentStock: 6,
        reservedStock: 0,
        minStockLevel: 2,
        supplierAvailable: true,
        supplierLeadTime: "4-5 days",
        description: "Heavy-duty tubular battery for trucks, buses, and commercial vehicles.",
        pros: ["Heavy-duty", "High capacity", "Long life"],
        cons: ["Very heavy", "Premium price"],
        images: ["https://images.unsplash.com/photo-1571884853377-f209c2927343?w=400"],
        isActive: true,
        compatibleVehicles: [
          { make: "Tata", model: "LPT", yearFrom: 2015, yearTo: 2024 },
          { make: "Ashok Leyland", model: "Ecomet", yearFrom: 2016, yearTo: 2024 },
        ],
      },
      // Home Inverter - SF
      {
        name: "SF Sonic IT600 Inverter Battery",
        brand: "SF Sonic",
        sku: "SF-IT600",
        category: "Home Inverter Batteries",
        subCategory: "Tubular",
        ahCapacity: 60,
        voltage: 12,
        batteryType: "Tubular",
        warranty: "30 months",
        purchasePrice: 5500,
        sellingPrice: 7800,
        gstRate: 28,
        currentStock: 18,
        reservedStock: 0,
        minStockLevel: 5,
        supplierAvailable: true,
        supplierLeadTime: "3-4 days",
        description: "Tubular inverter battery compatible with Microtek inverters. Good backup for homes.",
        pros: ["Good backup", "30 months warranty", "Microtek compatible"],
        cons: ["Regular maintenance needed"],
        images: ["https://images.unsplash.com/photo-1591870124873-6926895036e8?w=400"],
        isActive: true,
        compatibleVehicles: [],
      },
    ];

    for (const p of productData) {
      let existing = await Product.findOne({ sku: p.sku });
      if (!existing) {
        await Product.create(p);
        console.log(`Product created: ${p.name}`);
      }
    }

    // --- Seed Sample Customer ---
    let customer = await User.findOne({ email: "customer@test.com" });
    if (!customer) {
      customer = await User.create({
        name: "Rahul Sharma",
        email: "customer@test.com",
        mobile: "9876543210",
        password: "Test1234",
        role: "customer",
      });
      console.log("Sample customer created.");
    }

    // --- Seed Sample Orders ---
    const exideCar = await Product.findOne({ sku: "EX-CAR400" });
    const bikeBattery = await Product.findOne({ sku: "EX-BIKE7" });

    if (exideCar && !(await Order.findOne({ bookingId: "BK100001" }))) {
      await Order.create({
        customer: customer._id,
        bookingId: "BK100001",
        items: [
          {
            product: exideCar._id,
            productName: exideCar.name,
            brand: exideCar.brand,
            sku: exideCar.sku,
            quantity: 1,
            price: exideCar.sellingPrice,
            gstRate: exideCar.gstRate,
          },
        ],
        quantity: 1,
        totalAmount: exideCar.sellingPrice,
        gstAmount: Math.round((exideCar.sellingPrice * exideCar.gstRate) / 100),
        deliveryPreference: "pickup",
        status: "Completed",
        stockReserved: true,
      });
      exideCar.reservedStock = Math.max(0, exideCar.reservedStock - 1);
      exideCar.currentStock = Math.max(0, exideCar.currentStock - 1);
      await exideCar.save();
      console.log("Sample order created.");
    }

    if (bikeBattery && !(await Order.findOne({ bookingId: "BK100002" }))) {
      await Order.create({
        customer: customer._id,
        bookingId: "BK100002",
        items: [
          {
            product: bikeBattery._id,
            productName: bikeBattery.name,
            brand: bikeBattery.brand,
            sku: bikeBattery.sku,
            quantity: 2,
            price: bikeBattery.sellingPrice,
            gstRate: bikeBattery.gstRate,
          },
        ],
        quantity: 2,
        totalAmount: bikeBattery.sellingPrice * 2,
        gstAmount: Math.round((bikeBattery.sellingPrice * 2 * bikeBattery.gstRate) / 100),
        deliveryPreference: "delivery",
        deliveryAddress: { street: "123 Main St", city: "Delhi", state: "Delhi", pincode: "110001" },
        status: "Out for Delivery",
        stockReserved: true,
      });
      bikeBattery.reservedStock = Math.max(0, bikeBattery.reservedStock - 2);
      bikeBattery.currentStock = Math.max(0, bikeBattery.currentStock - 2);
      await bikeBattery.save();
      console.log("Sample order 2 created.");
    }

    // --- Seed Sample Maintenance Requests ---
    if (!(await MaintenanceRequest.findOne({ requestId: "MR300001" }))) {
      await MaintenanceRequest.create({
        requestId: "MR300001",
        customer: customer._id,
        customerName: "Rahul Sharma",
        customerMobile: "9876543210",
        address: { street: "123 Main St", city: "Delhi", state: "Delhi", pincode: "110001" },
        batteryCategory: "Car Battery",
        batteryBrand: "Exide",
        batteryModel: "FX400",
        problemDescription: "Battery not holding charge, needs replacement",
        preferredVisitTime: "Tomorrow 10 AM",
        status: "Resolved",
        assignedTechnician: "Rajesh Kumar",
        scheduledDate: new Date(Date.now() - 86400000),
        technicianRemarks: "Battery recharged and tested. Working fine now.",
        serviceCharge: 500,
        resolvedAt: new Date(),
      });
      console.log("Sample maintenance request created.");
    }

    if (!(await MaintenanceRequest.findOne({ requestId: "MR300002" }))) {
      await MaintenanceRequest.create({
        requestId: "MR300002",
        customerName: "Amit Patel",
        customerMobile: "9988776655",
        address: { street: "45 Park Avenue", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
        batteryCategory: "Home Inverter Battery",
        batteryBrand: "SF Sonic",
        batteryModel: "CR100",
        problemDescription: "Low backup time, battery not charging properly",
        preferredVisitTime: "Today 3 PM",
        status: "Technician Assigned",
        assignedTechnician: "Suresh Yadav",
        scheduledDate: new Date(Date.now() + 3600000),
        technicianRemarks: "Technician assigned, visiting today.",
        serviceCharge: 0,
      });
      console.log("Sample maintenance request 2 created.");
    }

    console.log("\nSeeding complete!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();