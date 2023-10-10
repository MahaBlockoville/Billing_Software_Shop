const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let Admin = require("../models/admin.model");
let User = require("../models/user.model");
let Salary = require("../models/salary.model");
let SalaryReceipt = require("../models/salaryReceipt.model");
const { json } = require("express");
const moment  = require('moment');
const TeamAndRole = require("../models/teams.and.roles.model");
const Loan = require("../models/loan.model");
const Branch = require("../models/branch.model");
const InWard = require("../models/inward.model");
const Sale = require("../models/sale.model");
const Category = require("../models/category.model");
const Supplier = require("../models/supplier.model");
const Product = require("../models/product.model");
const Expense = require("../models/expense.model");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    // check if already one admin is present or not
    /*const admin = await Admin.find({role: 'admin'}).countDocuments();

    if (admin)
      return res
        .status(400)
        .json({ msg: "There can be only one admin at max" });*/

    let { email, password, passwordCheck, name } = req.body;

    // validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Please enter the same password twice" });
    }

    const existingUser = await Admin.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new Admin({
      email,
      password: passwordHash,
      name,
      role: req.body.role ? req.body.role : "admin",
      leaveRequests: [],
      bonusRequests: [],
      loanRequests: [],
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: register a user
router.post("/branchUserUpdate", async (req, res) => {
  try {
    // check if already one admin is present or not
    /*const admin = await Admin.find({role: 'admin'}).countDocuments();

    if (admin)
      return res
        .status(400)
        .json({ msg: "There can be only one admin at max" });*/

    let { email, password, passwordCheck, name, branch_user_id } = req.body;

    // validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Please enter the same password twice" });
    }
    if (!name) name = email;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const existingUser = await Admin.findOne({ _id: branch_user_id });
    if(existingUser.role === 'branch') {
      existingUser.email = email;
    }
    existingUser.name = name;
    existingUser.password = passwordHash
    const savedUser = await existingUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// @desc: get branch a user
router.get("/getBranchUser/:name", async (req, res) => {
  try {
    console.log(req.params.name);
    const existingUser = await Admin.findOne({ name: req.params.name });
    res.json(existingUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields" });
    
    let query =  {
      '$or': [ 
        { 'email': email }, 
        { 'name': email }
      ]
    }
    const user = await Admin.findOne(query);
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid username or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: verify a user against token
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await Admin.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get user details of logged in user
router.get("/", auth, async (req, res) => {
  const user = await Admin.findById(req.user);
  res.json({
    user,
  });
});

// @desc: add employee by admin
router.post("/addEmployee", async (req, res) => {
  try {
    let { email, name, address, phoneNo, role, team, branch, doj, gender } = req.body;

    // validation
    if (
      !email ||
      !name ||
      !address ||
      !phoneNo ||
      !branch ||
      !doj ||
      gender === "Select Value"
    ) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    // generating password
    const password = "password";

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      name,
      gender,
      team,
      phoneNo,
      address,
      role,
      doj,
      branch,
      notification: [],
      alert: [],
    });

    const savedUser = await newUser.save();

    // create entry in salary model
    const newSalaryDetails = new Salary({
      empId: savedUser._id,
      empName: name,
      basicPay: 0,
      totalLeaves: 0,
      travelAllowance: 0,
      medicalAllowance: 0,
      bonus: 0,
      salary: 0,
    });

    await newSalaryDetails.save();

    // create entry in SALARYRECEIPT MODEL
    const newSalaryReceipt = new SalaryReceipt({
      empId: savedUser._id,
      empName: name,
      currentSalary: 0,
      monthlyReceipts: [],
    });

    await newSalaryReceipt.save();

    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: add addInWard by admin
router.post("/addInWard", async (req, res) => {
  try {
    console.log("Please enter", req.body.imei_number);

    let {  imei_number, purchase_value, selling_value, 
      gst_percentage, branch, product, doi, type, quantity, reference_invoice_number } = req.body;
    // validation
    if (
      !purchase_value||
      !selling_value ||
      !branch ||
      !product ||
      !doi) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    const product_value = await Product.findOne({_id: product});

    if(!req.body.inward_id) {
    console.log("Please enter", imei_number);
    imei_number.length > 0 && imei_number.map(async (data) => {
      const existing = await InWard.findOne({ imei_number: data });
      console.log(existing, 'existing');
      if (existing) {
        const message = existing.product.category.name  === 'Accessories' ? 
        "The serial_number is already in use by another stock." : 
        "The imei_number is already in use by another stock.";
        return res.status(400).json({
          msg: message,
        });
      }
      const newInward = new InWard({
        imei_number: data, purchase_value, selling_value, 
        gst_percentage, branch, product: product_value, doi, type, is_sale: false, reference_invoice_number
      });
      const savedInWard = await newInward.save();
      res.json(savedInWard);
    })
    /**/

    }else {
      const existing = await InWard.findOne({ 
        imei_number: imei_number,
        _id: {$ne: req.body.inward_id}
      });
      console.log(existing, 'existing');
      if (existing) {
        const message = existing.product.category.name  === 'Accessories' ? 
        "The serial_number is already in use by another stock." : 
        "The imei_number is already in use by another stock.";
        return res.status(400).json({
          msg: message,
        });
      }
      InWard.findOneAndUpdate(
        { _id: req.body.inward_id },
        {
          imei_number, purchase_value, selling_value, 
          gst_percentage, branch, product: product_value, doi, is_sale: false, reference_invoice_number
        },
        { new: true },
        function (err, result) {
          if (err) {
            res.status(400).json("Error: ", err);
          } else {
            res.json(result);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// @desc: add addSale by admin
router.post("/addSale", async (req, res) => {
  try {
    let {name, imei_number, phone, address, email, selling_value, 
      tenure, branch, payment_type, dos, gst_number, gst_percentage, type, sales_person,
      finance_name, order_no, shipping_address, shipping_name, shipping_email, shipping_phone} = req.body;
    // validation
    if (
      !name ||
      !imei_number ||
      !phone ||
      !address||
      !selling_value ||
      !branch ||
      !payment_type ||
      !dos) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    const salesCount = await Sale.countDocuments({
      type: {$in: ['wgst', 'wogst']}
    })      
    const invoice_id = process.env.INVOICE_ID + '/00' + (parseInt(salesCount) + 1);
    console.log(invoice_id, 'invoice_id');
    const inward_value = await InWard.findOne({imei_number: imei_number});
    await InWard.findOneAndUpdate({imei_number: imei_number}, {is_sale: true});
    if(!req.body.sale_id) {
    const newSaleItem = new Sale({
      name, imei_number, phone, address, email, selling_value, 
      tenure, branch, payment_type, dos, gst_number, gst_percentage, type,
      category: inward_value.category, sales_person, invoice_id,
      inward: inward_value, finance_name, order_no, shipping_address, 
      shipping_name, shipping_email, shipping_phone
    });
    const savedSaleItem = await newSaleItem.save();
    res.json(savedSaleItem);
    }else {
      Sale.findOneAndUpdate(
        { _id: req.body.sale_id },
        {
          name, imei_number, phone, address, email, selling_value, 
          tenure, branch, payment_type, dos, gst_number, gst_percentage,sales_person,
          category: inward_value.category, inward: inward_value, finance_name, order_no, 
          shipping_address, shipping_name, shipping_email, shipping_phone
        },
        { new: true },
        function (err, result) {
          if (err) {
            res.status(400).json("Error: ", err);
          } else {
            res.json(result);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: get list of all emp
router.get("/getSaleCount", async (req, res) => {
  let query = {};
  console.log('moment', moment().format('Y-MM-DD'));
  query.type = {$in: ['wgst', 'wogst']}
  query.dos = moment().format('Y-MM-DD');
  const empList = await Sale.find(query).countDocuments();
  console.log(empList, 'countDocuments');
  res.json(empList);
});


// @desc: approve/reject requests
router.put("/takeAction", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userReq.empId });
  if (!user) return res.status(400).json({ msg: "user not found" });

  let isApproved = false;

  // update emp's notification list: status from PENDING --> Approved/Rejected
  let updatedNotificationList = [];
  user.notification.forEach((notification) => {
    if (notification.reqId === req.body.userReq.reqId) {
      if (req.body.userReq.approved) {
        //if approved by admin
        isApproved = true;
        notification.approved = true;
        notification.ticketClosed = true;
      } else {
        //if not approved by admin
        notification.approved = false;
        notification.ticketClosed = true;
      }
      updatedNotificationList.push(notification);
    } else {
      updatedNotificationList.push(notification);
    }
  });

  // since approved/rejected send a notification to user in ALERT's ARRAY
  let alert = user.alert;
  let newAlert = {
    reqId: req.body.userReq.reqId,
    subject:
      req.body.userReq.subject ||
      req.body.userReq.loanReason ||
      req.body.userReq.bonusReason,
    reason:
      req.body.userReq.reason ||
      req.body.userReq.loanNote ||
      req.body.userReq.bonusNote,
    createdOn: req.body.userReq.date,
    approved: req.body.userReq.approved,
  };
  alert.push(newAlert);

  User.findOneAndUpdate(
    { _id: req.body.userReq.empId },
    { notification: updatedNotificationList, alert: alert },
    { new: true },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
    }
  );

  // remove that particular req from admins req tab
  const admin = await Admin.findById(req.body.adminId);

  if (req.body.userReq.title === "leave request") {
    // leave requests
    let updatedLeaveReq = [];

    admin.leaveRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedLeaveReq.push(request);
    });

    Admin.findByIdAndUpdate(
      req.body.adminId,
      { leaveRequests: updatedLeaveReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );

    // if approved: update emp's SALARY MODEL : increament leaveCount by no of leaves taken
    // cal date difference
    if (isApproved) {
      const dateOne = new Date(req.body.userReq.fromDate);
      const dateTwo = new Date(req.body.userReq.toDate);
      const differenceInTime = dateTwo.getTime() - dateOne.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;

      const salDetail = await Salary.findOne({ empId: req.body.userReq.empId });
      let currentLeaves = parseInt(salDetail.totalLeaves);
      currentLeaves += differenceInDays;

      await Salary.findOneAndUpdate(
        { empId: req.body.userReq.empId },
        { totalLeaves: currentLeaves },
        { new: true }
      );
    }
  } else if (req.body.userReq.title === "bonus request") {
    // bonus requests
    let updatedBonusReq = [];

    // remove that particular req from admin's notification
    admin.bonusRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedBonusReq.push(request);
    });

    Admin.findByIdAndUpdate(
      req.body.adminId,
      { bonusRequests: updatedBonusReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );
  } else {
    try {
      // loan requests
      // remove that particular req from admin's notification
      let updatedLoanReq = [];

      admin.loanRequests.forEach((request) => {
        if (request.reqId !== req.body.userReq.reqId)
          updatedLoanReq.push(request);
      });

      Admin.findByIdAndUpdate(
        req.body.adminId,
        { loanRequests: updatedLoanReq },
        { new: true },
        function (err, result) {
          if (err) res.status(400).json("Error: ", err);
        }
      );

      // add loan details to LOAN MODEL only if approved
      if (isApproved) {
        const newLoan = new Loan({
          reqId: req.body.userReq.reqId,
          empId: req.body.userReq.empId,
          date: req.body.userReq.date,
          empName: req.body.userReq.empName,
          gender: req.body.userReq.gender,
          empRole: req.body.userReq.empRole,
          empTeam: req.body.userReq.empTeam,
          empEmail: req.body.userReq.empEmail,
          loanNote: req.body.userReq.loanNote,
          loanReason: req.body.userReq.loanReason,
          modeOfRepayment: req.body.userReq.modeOfRepayment,
          timePeriod: req.body.userReq.timePeriod,
          amount: req.body.userReq.amount,
          loanRepaid: false,
        });

        const savedLoan = await newLoan.save();
        res.json(savedLoan);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

// @desc: get list of all emp
router.get("/getEmpList", async (req, res) => {
  const empList = await User.find({});
  res.send(empList);
});

// @desc: addExpense by admin
router.post("/addExpense", async (req, res) => {
  try {
    let { brand,
      content,
      expense,
      doe,
      amount } = req.body;
    // validation
    if (
      !content ||
      !expense ||
      !doe ||
      !amount) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
      const newExpense = new Expense({
        brand,
        content,
        expense,
        doe,
        amount
      });
      const savedExpense = await newExpense.save();
      res.json(savedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: add branch by admin
router.post("/addBranch", async (req, res) => {
  try {
    let { name, address, phoneNo, dop, gst_number, prev_name } = req.body;
    // validation
    if (
      !name ||
      !address ||
      !phoneNo ||
      !dop) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    if(req.body.branch_id) {
      if(prev_name !== name) {
        InWard.updateMany({branch: prev_name}, {branch: name}, function (err, result) {
          console.log(result, err);
        })
        Sale.updateMany({branch: prev_name}, {branch: name}, function (err, result) {
          console.log(result, err);
        })
      }
      Branch.findOneAndUpdate(
        { _id: req.body.branch_id },
        {
          name,
          phoneNo,
          address,
          dop,
          gst_number
        },
        { new: true },
        function (err, result) {
          if (err) {
            res.status(400).json("Error: ", err);
          } else {
            res.json(result);
          }
        }
      );
    }else {
      const newBranch = new Branch({
        name,
        phoneNo,
        address,
        dop,
        gst_number
      });
      const savedBranch = await newBranch.save();
      res.json(savedBranch);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: get list of all emp
router.get("/getBranchList", async (req, res) => {
  const branchList = await Branch.find({});
  res.send(branchList);
});

// @desc: get a particular branch data
router.get("/getBranchData/:id", async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    res.json(branch);
  } catch (err) {
    res.status(500).json(err);
  }
});
// @desc: get a particular branch data by name
router.get("/getBranchDataByName/:name", async (req, res) => {
  try {
    const branch = await Branch.findOne({name: req.params.name});
    res.json(branch);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: delete a user branch
router.delete("/deleteBranch/:id", async (req, res) => {
  try {
    const deleteBranch = await Branch.findByIdAndDelete(req.params.id);
    res.json(deleteBranch);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


// @desc: add category by admin
router.post("/addCategory", async (req, res) => {
  try {
    let { name } = req.body;
    // validation
    if (
      !name ) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    if(!req.body.category_id) {
      const newCategory = new Category({
        name
      });
      const savedCategory = await newCategory.save();
      res.json(savedCategory);
    }else {
      Category.findOneAndUpdate(
        { _id: req.body.category_id },
        {
          name
        },
        { new: true },
        function (err, result) {
          if (err) {
            res.status(400).json("Error: ", err);
          } else {
            res.json(result);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: get a particular category data
router.get("/getCategoryData/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});


// @desc: get list of all category
router.get("/getCategoryList", async (req, res) => {
  const categoryList = await Category.find({});
  res.send(categoryList);
});

// @desc: delete a user stock
router.delete("/deleteStock/:id", async (req, res) => {
  try {
    const deleteStock = await InWard.findByIdAndDelete(req.params.id);
    res.json(deleteStock);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: delete a user stock
router.delete("/deleteSale/:id", async (req, res) => {
  try {
    const sale_data = await Sale.findOne({_id: req.params.id});
    const inward_data = await InWard.findOneAndUpdate({_id: sale_data.inward._id}, {is_sale: false});
    const deleteSale = await Sale.findByIdAndDelete(req.params.id);

    res.json(deleteSale);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get a particular inward data
router.get("/returnSale/:id/:type", async (req, res) => {
  console.log(req.params, 'req.params');
  try {
    if(req.params.type === 'wgst') {
      var type = 'wgstReturn'
    }
    if(req.params.type === 'wogst') {
      var type = 'wogstReturn'
    }
    const sale = await Sale.findOneAndUpdate(
      { _id: req.params.id },
      { type: type  },
    );
    await InWard.findOneAndUpdate({_id: sale.inward._id}, {is_sale: false});
    console.log(sale);
    res.json(sale);
  } catch (err) {
    res.status(500).json(err);
  }
});
// @desc: delete a user category
router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    res.json(deletedCategory);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: add supplier by admin
router.post("/addSupplier", async (req, res) => {
  try {

    let {  company_name, contact_person, contact_number, gst_number, address } = req.body;
    // validation
    if (
      !company_name ||
      !contact_person ||
      !contact_number ||
      !gst_number ||
      !address) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    if(!req.body.supplier_id) {
      const newSupplier = new Supplier({
         company_name, contact_person, contact_number, gst_number, address
      });
      const savedSupplier = await newSupplier.save();
      res.json(savedSupplier);
    }else {
      Supplier.findOneAndUpdate(
        { _id: req.body.supplier_id },
        {
           company_name, contact_person, contact_number, gst_number, address
        },
        { new: true },
        function (err, result) {
          if (err) {
            res.status(400).json("Error: ", err);
          } else {
            res.json(result);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: get a particular supplier data
router.get("/getSupplierData/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.json(supplier);
  } catch (err) {
    res.status(500).json(err);
  }
});


// @desc: get list of all supplier
router.get("/getSupplierList", async (req, res) => {
  const supplierList = await Supplier.find({});
  res.send(supplierList);
});


// @desc: delete a supplier
router.delete("/deleteSupplier/:id", async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    res.json(deletedSupplier);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: add product by admin
router.post("/addProduct", async (req, res) => {
  try {

    let { name, variant, model, color, supplier, category, hsn, selling_value, purchase_value } = req.body;
    // validation
    if (
      !name ||
      !variant ||
      !model ||
      !color ||
      !selling_value ||
      !purchase_value ||
      !category) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    let supplier_value = {};
    if(supplier) {
      supplier_value = await Supplier.findOne({company_name: supplier});
    }
    const category_value = await Category.findOne({name: category});
    if(!req.body.product_id) {
      const newProduct = new Product({
        name, variant, model, color, supplier: supplier_value, category: category_value, hsn, selling_value, purchase_value
      });
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    }else {
      Product.findOneAndUpdate(
        { _id: req.body.product_id },
        {
          name, variant, model, color, supplier: supplier_value, category: category_value, hsn, selling_value, purchase_value
        },
        { new: true },
        function (err, result) {
          if (err) {
            res.status(400).json("Error: ", err);
          } else {
            res.json(result);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: get a particular product data
router.get("/getProductData/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});


// @desc: get list of all product
router.get("/getProductList", async (req, res) => {
  const productList = await Product.find({});
  res.send(productList);
});


// @desc: delete a product
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.json(deletedProduct);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get list of all inward
router.get("/getInWardList", async (req, res) => {
  const query = {}
  if(req.query.type) {
    query.type = req.query.type
  }
  if(req.query.branch) {
    query.branch = req.query.branch
  }
  
  if(req.query.stock) {
    query.type = {$in: req.query.stock.split(",")};
  }
  query.is_sale = false;
  console.log(query);
  const inwardList = await InWard.find(query).sort({_id: -1});
  res.send(inwardList);
});

// @desc: get list of all sales
router.get("/getSalesList", async (req, res) => {
  const query = {}
  if(req.query.type) {
    if(req.query.type === 'wgst') {
      query.type = 'wgst'
    }
    if(req.query.type === 'wogst') {
      query.type = 'wogst'
    }
    if(req.query.type === 'return') {
      query.type = {$in: ['wgstReturn', 'wogstReturn']}
    }
  }
  if(req.query.branch) {
    query.branch = req.query.branch;
  }
  console.log(query);
  const salesList = await Sale.find(query).sort({_id: -1});
  res.send(salesList);
});

// @desc: get list of all inward
router.get("/getDayBook", async (req, res) => {
  let dayBookData;
  console.log(req.query.from_date, moment().format('MMMM'));
  if(req.query.from_date || req.query.to_date) {
    const query = {};
    const sales_query = {};
    const expense_query = {};
    if (req.query.from_date != undefined && req.query.from_date != "") {
      expense_query.doe = { $gte: moment(req.query.from_date).format('Y-MM-DD') };

      sales_query.dos = { $gte: moment(req.query.from_date).format('Y-MM-DD') };

      query.doi = { $gte: moment(req.query.from_date).format('Y-MM-DD') };
    }else {
      expense_query.doe = { $gte: moment().format('Y-MM-DD') };

      sales_query.dos = { $gte: moment().format('Y-MM-DD') };

      query.doi = { $gte: moment().format('Y-MM-DD') };
    }
    if (req.query.to_date != undefined && req.query.to_date != "") {
      expense_query.doe = { $lte: moment(req.query.to_date).format('Y-MM-DD') };

      sales_query.dos = { $lte: moment(req.query.to_date).format('Y-MM-DD') };

      query.doi = { $lte: moment(req.query.to_date).format('Y-MM-DD') };
    }else {
      expense_query.doe = { $lte: moment().format('Y-MM-DD') };

      sales_query.dos = { $lte: moment().format('Y-MM-DD') };

      query.doi = { $lte: moment().format('Y-MM-DD') };
    }
    if(req.query.branch) {
      expense_query.doe = req.query.branch;

      sales_query.dos = req.query.branch;

      query.doi = req.query.branch;
    }
    console.log(query);
    const inwardList = await InWard.find(query);
    console.log(inwardList);

    const salesList = await Sale.find(sales_query);
    console.log(salesList);

    const expenseList = await Expense.find(expense_query);
    console.log(expenseList);

    dayBookData = inwardList.concat(salesList);
    res.send({
      dayBookData: dayBookData,
      expenseList: expenseList
    });
  }else {

    let sales_query = {
      dos: moment().format('Y-MM-DD')
    }
    let query = {
      doi: moment().format('Y-MM-DD')
    }
    if(req.query.branch) {
      sales_query.dos = req.query.branch;
      query.doi = req.query.branch;
    }

    const inwardList = await InWard.find(query);
    const salesList = await Sale.find(sales_query);
    dayBookData = inwardList.concat(salesList);
    res.send(dayBookData);
  }
});


// @desc: delete a user account
router.delete("/deleteUser/:id", async (req, res) => {
  console.log(req.params.id, 'deletedUser');

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
console.log(deletedUser, 'deletedUser');
    // delete corresponding SALARY DETAILS too
    const deletedSalDetails = await Salary.findOneAndDelete({
      empId: req.params.id,
    });
    // delete corresponding SALARYRECEIPT DETAILS too
    const deletedSalReceipt = await SalaryReceipt.findOneAndDelete({
      empId: req.params.id,
    });

    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get a particular users data
router.get("/getUserData/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: get a particular inward data
router.get("/getInWardData/:id", async (req, res) => {
  try {
    const inward = await InWard.findById(req.params.id);
    res.json(inward);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: get a particular inward data
router.get("/returnStock/:id/:type", async (req, res) => {
  console.log(req.params, 'req.params');
  try {
    if(req.params.type === 'firstPurchase') {
      var type = 'purchaseReturn'
    }
    if(req.params.type === 'secondPurchase') {
      var type = 'secondReturn'
    }
    const inward = await InWard.findOneAndUpdate(
      { _id: req.params.id },
      { type: type }
    );
    res.json(inward);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: get a particular sales data
router.get("/getSaleData/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    res.json(sale);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: get a particular sales data
router.get("/getBranchData/:name", async (req, res) => {
  try {
    const sale = await Branch.findOne({name: req.params.name});
    res.json(sale);
  } catch (err) {
    res.status(500).json(err);
  }
});


// @desc: search component
router.post("/search", async (req, res) => {
  let name = req.body.name;
  let role = req.body.role;
  let branch = req.body.branch;
  let email = req.body.email;
  let doj = req.body.doj;


  // if fields are empty, match everything
  if (name === "") name = new RegExp(/.+/s);
  if (role === "") role = new RegExp(/.+/s);
  if (branch === "") branch = new RegExp(/.+/s);
  if (email === "") email = new RegExp(/.+/s);
  if (doj === "") doj = new RegExp(/.+/s);


  User.find({
    name: new RegExp(name, "i"),
    role: new RegExp(role, "i"),
    branch: new RegExp(branch, "i"),
    email: new RegExp(email, "i"),
    doj: new RegExp(doj, "i"),
  })
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: search branch component
router.post("/searchBranch", async (req, res) => {
  let name = req.body.name;
  let dop = req.body.dop;
  // if fields are empty, match everything
  if (name === "") name = new RegExp(/.+/s);
  if (dop === "") dop = new RegExp(/.+/s);
  Branch.find({
    name: new RegExp(name, "i"),
    dop: new RegExp(dop, "i"),
  })
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: search searchInward component
router.post("/searchInward", async (req, res) => {
  let name = req.body.name;
  let doi = req.body.doi;
  let branch = req.body.branch; 
  let category = req.body.category;
  let type = req.body.type;

  if (doi === "") doi = new RegExp(/.+/s);
  if(branch === "" )branch = new RegExp(/.+/s);
  let filter = {
    $and: [
      { doi: new RegExp(doi, "i") }
    ]
  };
  
  if(branch && branch !== 'All' && branch !== 'Select'){
    filter.$and.push({branch: branch});
  }

  if(name !== "") {
    filter.$or =  [ 
      { 'product.name': new RegExp(name, "i") }, 
      { imei_number: new RegExp(name, "i") },
      { 'product.color': new RegExp(name, "i") }, 
      { 'product.model': new RegExp(name, "i") }, 
      { 'product.variant': new RegExp(name, "i") }, 
    ];
  }
  if(category && category !== 'All' && category !== 'Select'){
    filter.$and.push({'product.category.name': category});
  }
  if(type){
    filter.$and.push({type: type});
  }
  if(req.body.stock) {
    filter.$and.push({type: {$in: req.body.stock}});
  }
  filter.$and.push({is_sale: false});
  console.log(filter);
  InWard.find(filter).sort({_id: -1})
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: search sale component
router.post("/searchSale", async (req, res) => {
  let name = req.body.name;
  let dos = req.body.dos;
  let category = req.body.category;
  let type = req.body.type;
  let branch = req.body.branch;

  if (dos === "") dos = new RegExp(/.+/s);
  if(branch === "" )branch = new RegExp(/.+/s);
  let filter = {
    $and: [
      { dos: new RegExp(dos, "i") }
    ]
  };
  
  if(branch && branch !== 'All' && branch !== 'Select'){
    filter.$and.push({branch: branch});
  }

  if(name !== "") {
    filter.$or =  [ 
      { 'inward.product.name': new RegExp(name, "i") }, 
      { imei_number: new RegExp(name, "i") },
      { 'inward.product.color': new RegExp(name, "i") }, 
      { 'inward.product.model': new RegExp(name, "i") }, 
      { 'inward.product.variant': new RegExp(name, "i") }, 
    ];
  }
  if(category && category !== 'All' && category !== 'Select'){
    filter.$and.push({'inward.product.category.name': category});
  }
  if(type){
    filter.$and.push({type: type});
  }
  console.log(filter);
  Sale.find(filter).sort({_id: -1})
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// ************************** SALARY PART: START ***********************************
// @desc: get list of emp's sal receipts
router.get("/getAllEmpsSalReceipt", async (req, res) => {
  const AllEmpsSalReceipt = await SalaryReceipt.find({});
  res.send(AllEmpsSalReceipt);
});

// @desc: get particular emp's sal receipt details
router.get("/getSingleEmpSalReceipts/:id", async (req, res) => {
  try {
    const singleEmpSalReceipts = await SalaryReceipt.findOne({
      empId: req.params.id,
    });
    res.json(singleEmpSalReceipts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: generate emp sal receipt for particular month
router.put("/generateSalReceipt", async (req, res) => {
  try {
    // update emp SALARY profile: clear bonus, total leaves
    await Salary.findOneAndUpdate(
      { empId: req.body.empId },
      { bonus: 0, totalLeaves: 0 }
    );

    const empReceiptDoc = await SalaryReceipt.findOne({
      empId: req.body.empId,
    });

    let monthlyReceipts = empReceiptDoc.monthlyReceipts;
    monthlyReceipts.push({
      month: req.body.month,
      year: req.body.year,
      salDetails: req.body.salDetails,
    });

    const updatedEmpReceiptDoc = await SalaryReceipt.findOneAndUpdate(
      { empId: req.body.empId },
      {
        monthlyReceipts: monthlyReceipts,
      },
      { new: true }
    );
    res.json({ updatedEmpReceiptDoc, monthlyReceipts });
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

// @desc: get list of emp's salary details
router.get("/getEmpSalList", async (req, res) => {
  try {
    const empSalList = await Salary.find({});
    res.json(empSalList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: get a particular users salary details
router.get("/getUserSalDetails/:id", async (req, res) => {
  try {
    const userSalDetails = await Salary.findOne({ empId: req.params.id });
    res.json(userSalDetails);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: update user salary details
router.put("/updateSalaryDetails/:id", async (req, res) => {
  try {
    const salDetails = req.body.salDetails;
    const salDoc = await Salary.findOneAndUpdate(
      { empId: req.params.id },
      {
        basicPay: salDetails.basicPay,
        totalLeaves: salDetails.totalLeaves,
        travelAllowance: salDetails.travelAllowance,
        medicalAllowance: salDetails.medicalAllowance,
        bonus: salDetails.bonus,
        salary: salDetails.salary,
      },
      { new: true }
    );

    // update corresponding SALARYRECEIPT MODEL's current salary:
    const salReceipt = await SalaryReceipt.findOneAndUpdate(
      { empId: req.params.id },
      {
        currentSalary: salDoc.salary,
      }
    );

    res.json(salDoc);
  } catch (e) {
    res.status(500).json({ err: err.message });
  }
});
// ************************** SALARY PART: END ***********************************

// ********************** OPTIONS PANEL APIS BEGIN *******************************
// @desc: get team list (adding a new team)
router.get("/getTeamsAndRoles", async (req, res) => {
  const teamsAndRoles = await TeamAndRole.find({});
  res.json(teamsAndRoles);
});

// @desc: add new team
router.post("/addNewTeam", async (req, res) => {
  const teamName = req.body.teamName;
  const teamObj = await TeamAndRole.find({});
  let teamList = teamObj.length > 0 ? teamObj[0].teamNames : [];

  teamList.push(teamName);
  let updatedTeamObj;
  if(teamObj.length > 0) {
    updatedTeamObj = await TeamAndRole.findOneAndUpdate(
      {},
      {
        teamNames: teamList,
      },
      { new: true }
    );
  }else {
    updatedTeamObj = await TeamAndRole.create(
      {
        teamNames: teamList,
      }
    );
  }
  res.json(updatedTeamObj);
});

// @desc: add new team
router.post("/addNewRole", async (req, res) => {
  const roleName = req.body.roleName;
  const teamObj = await TeamAndRole.find({});

  let roleList = teamObj[0].roleNames;
  roleList.push(roleName);

  const updatedTeamObj = await TeamAndRole.findOneAndUpdate(
    {},
    {
      roleNames: roleList,
    },
    { new: true }
  );

  res.json(updatedTeamObj);
});

// @desc: delete admin account
router.delete("/deleteAdminAcc/:id", async (req, res) => {
  try {
    const deletedAdminAcc = await Admin.findByIdAndDelete(req.params.id);
    res.json(deletedAdminAcc);
  } catch (e) {
    res.status(500).json(e);
  }
});
// ********************** OPTIONS PANEL APIS END *******************************

// ********************** LOAN APIS START *******************************
// @desc: get all loan docs from LOAN MODEL
router.get("/getLoanList", async (req, res) => {
  try {
    const loanList = await Loan.find({});
    res.json(loanList);
  } catch (e) {
    res.status(500).json(e);
  }
});

// @desc: get single emp's loan history
router.get("/getEmpLoanHistory/:id", async (req, res) => {
  try {
    const empLoanHistory = await Loan.find({ empId: req.params.id });
    res.json(empLoanHistory);
  } catch (e) {
    res.status(500).json(e);
  }
});

// @desc: mark particular loan as paid
router.put("/loanPaid", async (req, res) => {
  try {
    // update USER.notification MODEL
    const emp = await User.findById(req.body.empId);

    let notification = emp.notification;
    notification = notification.map((noti) => {
      if (noti.reqId === req.body.reqId) noti.loanRepaid = true;
      return noti;
    });

    await User.findByIdAndUpdate(req.body.empId, {
      notification,
    });

    // update LOAN MODEL
    const loan = await Loan.findByIdAndUpdate(
      req.body.loanId,
      {
        loanRepaid: true,
      },
      { new: true }
    );

    res.json(loan);
  } catch (e) {
    res.status(500).json(e);
  }
});
// ********************** LOAN APIS START *******************************
module.exports = router;
