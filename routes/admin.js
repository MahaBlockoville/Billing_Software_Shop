const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let Admin = require("../models/admin.model");
let User = require("../models/user.model");
let Salary = require("../models/salary.model");
let SalaryReceipt = require("../models/salaryReceipt.model");
const { json } = require("express");
const TeamAndRole = require("../models/teams.and.roles.model");
const Loan = require("../models/loan.model");
const Branch = require("../models/branch.model");
const InWard = require("../models/inward.model");
const Sale = require("../models/sale.model");
const Category = require("../models/category.model");
const Supplier = require("../models/supplier.mode");
const Product = require("../models/product.model");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    // check if already one admin is present or not
    const admin = await Admin.countDocuments();

    if (admin)
      return res
        .status(400)
        .json({ msg: "There can be only one admin at max" });

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
      role: "admin",
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

// @desc: login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields" });

    const user = await Admin.findOne({ email: email });
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

// @desc: add branch by admin
router.post("/addBranch", async (req, res) => {
  try {
    let { name, address, phoneNo, dop } = req.body;
    // validation
    if (
      !name ||
      !address ||
      !phoneNo ||
      !dop) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    const newBranch = new Branch({
      name,
      phoneNo,
      address,
      dop,
    });
    const savedBranch = await newBranch.save();
    res.json(savedBranch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// @desc: add addInWard by admin
router.post("/addInWard", async (req, res) => {
  try {
    let {  imei_number, purchase_value, selling_value, 
      gst_percentage, branch, product, doi } = req.body;
    // validation
    if (
      !imei_number ||
      !purchase_value||
      !selling_value ||
      !gst_percentage ||
      !branch ||
      !product ||
      !doi) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    const product_value = await Product.findOne({_id: product});

    if(req.body.type === 'firstPurchase') {
      type = 'first'
    }
    if(req.body.type === 'secondPurchase') {
      type = 'second'
    }
    if(req.body.type === 'secondReturn') {
      type = 'secondReturn'
    }
    if(req.body.type === 'purchaseReturn') {
      type = 'firstReturn'
    }

    if(!req.body.inward_id) {
    const newInward = new InWard({
      imei_number, purchase_value, selling_value, 
      gst_percentage, branch, product: product_value, doi, type
    });
    const savedInWard = await newInward.save();
    res.json(savedInWard);
    }else {
      InWard.findOneAndUpdate(
        { _id: req.body.inward_id },
        {
          imei_number, purchase_value, selling_value, 
          gst_percentage, branch, product: product_value, doi, type
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
      tenure, branch, payment_type, dos, gst_number, gst_percentage, type } = req.body;
    // validation
    if (
      !name ||
      !imei_number ||
      !phone ||
      !address||
      !email ||
      !selling_value ||
      !branch ||
      !payment_type ||
      !dos) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    const inward_value = await InWard.findOne({imei_number: imei_number});
    if(!req.body.sale_id) {
    const newSaleItem = new Sale({
      name, imei_number, phone, address, email, selling_value, 
      tenure, branch, payment_type, dos, gst_number, gst_percentage, type,
      category: inward_value.category,
      inward: inward_value
    });
    const savedSaleItem = await newSaleItem.save();
    res.json(savedSaleItem);
    }else {
      Sale.findOneAndUpdate(
        { _id: req.body.sale_id },
        {
          name, imei_number, phone, address, email, selling_value, 
          tenure, branch, payment_type, dos, gst_number, gst_percentage, type,
          category: inward_value.category, inward: inward_value
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

// @desc: get list of all emp
router.get("/getBranchList", async (req, res) => {
  const branchList = await Branch.find({});
  res.send(branchList);
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
    const deleteSale = await Sale.findByIdAndDelete(req.params.id);
    res.json(deleteSale);
  } catch (err) {
    res.status(500).json({ err: err.message });
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

    let { name, company_name, contact_person, contact_number, gst_number, address } = req.body;
    // validation
    if (
      !name ||
      !company_name ||
      !contact_person ||
      !contact_number ||
      !gst_number ||
      !address) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    if(!req.body.supplier_id) {
      const newSupplier = new Supplier({
        name, company_name, contact_person, contact_number, gst_number, address
      });
      const savedSupplier = await newSupplier.save();
      res.json(savedSupplier);
    }else {
      Supplier.findOneAndUpdate(
        { _id: req.body.supplier_id },
        {
          name, company_name, contact_person, contact_number, gst_number, address
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

    let { name, variant, model, color, supplier, category } = req.body;
    // validation
    if (
      !name ||
      !variant ||
      !model ||
      !color ||
      !supplier ||
      !category) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    const supplier_value = await Supplier.findOne({name: supplier});
    const category_value = await Category.findOne({name: category});
    if(!req.body.product_id) {
      const newProduct = new Product({
        name, variant, model, color, supplier: supplier_value, category: category_value
      });
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    }else {
      Product.findOneAndUpdate(
        { _id: req.body.product_id },
        {
          name, variant, model, color, supplier: supplier_value, category: category_value
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
    if(req.query.type === 'firstPurchase') {
      query.type = 'first'
    }
    if(req.query.type === 'secondPurchase') {
      query.type = 'second'
    }
    if(req.query.type === 'secondReturn') {
      query.type = 'secondReturn'
    }
    if(req.query.type === 'purchaseReturn') {
      query.type = 'firstReturn'
    }
  }
  const inwardList = await InWard.find(query);
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
      query.type = 'return'
    }
  }
  const salesList = await Sale.find(query);
  res.send(salesList);
});


// @desc: delete a user account
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    // delete corresponding SALARY DETAILS too
    const deletedSalDetails = await Salary.findOneAndDelete({
      empId: req.params.id,
    });

    // delete corresponding SALARYRECEIPT DETAILS too
    const deletedSalReceipt = await SalaryReceipt.findOneAndDelete({
      empId: req.params.id,
    });

    // delete corresponding LOAN DETAILS too
    await Loan.deleteMany({ empId: req.params.id });

    // delete req's if sent by this user
    const admin = await Admin.findById(req.body.adminId);

    const empId = req.params.id;

    let updatedLeaveRequests = [];
    let updatedBonusRequests = [];
    let updatedLoanRequests = [];

    updatedLeaveRequests = admin.leaveRequests.filter(
      (req) => req.empId !== empId
    );

    updatedBonusRequests = admin.bonusRequests.filter(
      (req) => req.empId !== empId
    );

    updatedLoanRequests = admin.loanRequests.filter(
      (req) => req.empId !== empId
    );

    await Admin.findOneAndUpdate(
      {},
      {
        leaveRequests: updatedLeaveRequests,
        bonusRequests: updatedBonusRequests,
        loanRequests: updatedLoanRequests,
      }
    );

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

// @desc: get a particular sales data
router.get("/getSaleData/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
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
  let smart_phone = req.body.smart_phone; 
  let branch = req.body.branch; 
  let feature_phone = req.body.feature_phone; 
  let accessory = req.body.accessory;
  // if fields are empty, match everything
  //if (name === "") name = new RegExp(/.+/s);
  if (doi === "") doi = new RegExp(/.+/s);
  if (branch === "All") branch = new RegExp(/.+/s);
  let filter = {
    $and: [
      { branch: new RegExp(branch, "i") },
      { doi: new RegExp(doi, "i") }
    ]
  };
  if(name !== "") {
    filter.$or =  [ 
      { name: new RegExp(name, "i") }, 
      { imei_number: new RegExp(name, "i") },
      { color: new RegExp(name, "i") }, 
      { model: new RegExp(name, "i") }, 
      { variant: new RegExp(name, "i") }, 
    ];
  }
  if(smart_phone && smart_phone !== 'All' && smart_phone !== 'None'){
    filter.$and.push({name: new RegExp(smart_phone, 'i')});
  }
  if(feature_phone && feature_phone !== 'All' && feature_phone !== 'None'){
    filter.$and.push({name: new RegExp(feature_phone, 'i')});
  }
  if(accessory && accessory !== 'All' && accessory !== 'None'){
    filter.$and.push({name: new RegExp(accessory, 'i')});
  }
  if(smart_phone && smart_phone === 'None') {
    filter.$and.push({category: {$ne: 'Smart Phone'}});
  }
  if(feature_phone && feature_phone === 'None') {
    filter.$and.push({category: {$ne: 'Featured Phone'}});
  }
  if(accessory && accessory === 'None') {
    filter.$and.push({category: {$ne: 'Accessories'}});
  }
  if(smart_phone === 'All' && feature_phone === 'All' && accessory === 'All'){
    category = new RegExp(/.+/s);
    filter.$and.push({category: new RegExp(category, 'i')});
  }
  if(smart_phone === 'None' && feature_phone === 'None'){
    filter.$and.push({category: {$nin: ['Smart Phone', 'Featured Phone']}});
  }
  if(feature_phone === 'None' && accessory === 'None'){
    filter.$and.push({category: {$nin: ['Accessories', 'Featured Phone']}});
  }
  if(accessory === 'None' && smart_phone === 'None'){
    filter.$and.push({category: {$nin: ['Accessories', 'Smart Phone']}});
  }
  if(accessory === 'None' && smart_phone === 'None' && feature_phone === 'None'){
    filter.$and.push({category: {$nin: ['Accessories', 'Smart Phone', 'Featured Phone']}});
  }
  
  console.log(filter);
  InWard.find(filter)
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: search sale component
router.post("/searchSale", async (req, res) => {
  let name = req.body.name;
  let dos = req.body.dos;
  let smart_phone = req.body.smart_phone; 
  let branch = req.body.branch; 
  let feature_phone = req.body.feature_phone; 
  let accessory = req.body.accessory;
  // if fields are empty, match everything
  //if (name === "") name = new RegExp(/.+/s);
  if (dos === "") dos = new RegExp(/.+/s);
  if (branch === "All") branch = new RegExp(/.+/s);
  let filter = {
    $and: [
      { branch: new RegExp(branch, "i") },
      { dos: new RegExp(dos, "i") }
    ]
  };
  if(name !== "") {
    filter.$or =  [ 
      { name: new RegExp(name, "i") }, 
      { imei_number: new RegExp(name, "i") },
      { phone: new RegExp(name, "i") }, 
      { email: new RegExp(name, "i") },
    ];
  }
  if(smart_phone && smart_phone !== 'All' && smart_phone !== 'None'){
    filter.$and.push({name: new RegExp(smart_phone, 'i')});
  }
  if(feature_phone && feature_phone !== 'All' && feature_phone !== 'None'){
    filter.$and.push({name: new RegExp(feature_phone, 'i')});
  }
  if(accessory && accessory !== 'All' && accessory !== 'None'){
    filter.$and.push({name: new RegExp(accessory, 'i')});
  }
  if(smart_phone && smart_phone === 'None') {
    filter.$and.push({category: {$ne: 'Smart Phone'}});
  }
  if(feature_phone && feature_phone === 'None') {
    filter.$and.push({category: {$ne: 'Featured Phone'}});
  }
  if(accessory && accessory === 'None') {
    filter.$and.push({category: {$ne: 'Accessories'}});
  }
  if(smart_phone === 'All' && feature_phone === 'All' && accessory === 'All'){
    category = new RegExp(/.+/s);
    filter.$and.push({category: new RegExp(category, 'i')});
  }
  if(smart_phone === 'None' && feature_phone === 'None'){
    filter.$and.push({category: {$nin: ['Smart Phone', 'Featured Phone']}});
  }
  if(feature_phone === 'None' && accessory === 'None'){
    filter.$and.push({category: {$nin: ['Accessories', 'Featured Phone']}});
  }
  if(accessory === 'None' && smart_phone === 'None'){
    filter.$and.push({category: {$nin: ['Accessories', 'Smart Phone']}});
  }
  if(accessory === 'None' && smart_phone === 'None' && feature_phone === 'None'){
    filter.$and.push({category: {$nin: ['Accessories', 'Smart Phone', 'Featured Phone']}});
  }
  
  console.log(filter);
  Sale.find(filter)
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
