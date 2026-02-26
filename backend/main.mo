import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Types
  module MedicineCategory {
    public type Variant = {
      #antiCancer;
      #antiFungal;
      #antiViral;
      #arthritis;
      #bloodDisorders;
      #general;
      #heartDisease;
      #hepatitis;
      #hivAids;
      #infertility;
      #nephrology;
      #osteoporosis;
      #skinDisease;
      #transplant;
      #vaccine;
      #weightLoss;
      #diabetesCare;
      #cardiacCare;
      #otcProducts;
      #surgicalDevices;
    };

    public func compare(cat1 : Variant, cat2 : Variant) : Order.Order {
      func variantOrder(variant : Variant) : Nat {
        switch (variant) {
          case (#antiCancer) { 0 };
          case (#antiFungal) { 1 };
          case (#antiViral) { 2 };
          case (#arthritis) { 3 };
          case (#bloodDisorders) { 4 };
          case (#general) { 5 };
          case (#heartDisease) { 6 };
          case (#hepatitis) { 7 };
          case (#hivAids) { 8 };
          case (#infertility) { 9 };
          case (#nephrology) { 10 };
          case (#osteoporosis) { 11 };
          case (#skinDisease) { 12 };
          case (#transplant) { 13 };
          case (#vaccine) { 14 };
          case (#weightLoss) { 15 };
          case (#diabetesCare) { 16 };
          case (#cardiacCare) { 17 };
          case (#otcProducts) { 18 };
          case (#surgicalDevices) { 19 };
        };
      };
      let order1 = variantOrder(cat1);
      let order2 = variantOrder(cat2);

      if (order1 < order2) { #less } else if (order1 > order2) { #greater } else { #equal };
    };
  };

  public type MedicineCategory = MedicineCategory.Variant;

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    category : MedicineCategory;
    requiresPrescription : Bool;
    stockStatus : Bool;
    imageUrl : Text;
  };

  public type Address = {
    addressLabel : Text;
    address : Text;
    city : Text;
    pincode : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phoneNumber : Text;
    addresses : List.List<Address>;
  };

  public type PaymentMethod = {
    #cod;
    #upi;
    #card;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
  };

  public type Order = {
    id : Text;
    customerId : Principal;
    items : List.List<OrderItem>;
    deliveryAddress : Text;
    status : OrderStatus;
    timestamp : Time.Time;
    totalAmount : Float;
    paymentMethod : PaymentMethod;
    prescription : ?BlobStorage.ExternalBlob;
  };

  public type OrderStatus = {
    #received;
    #verified;
    #packed;
    #outForDelivery;
    #delivered;
  };

  public type BlogPost = {
    id : Text;
    title : Text;
    content : Text;
    category : Text;
    author : Text;
    coverImageUrl : Text;
    status : Bool; // true for published, false for draft
    createdAt : Time.Time;
  };

  public type SearchResult = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    category : MedicineCategory;
    requiresPrescription : Bool;
    stockStatus : Bool;
    imageUrl : Text;
  };

  // View Types (Immutable)
  public type OrderView = {
    id : Text;
    customerId : Principal;
    items : [OrderItem];
    deliveryAddress : Text;
    status : OrderStatus;
    timestamp : Time.Time;
    totalAmount : Float;
    paymentMethod : PaymentMethod;
    prescription : ?BlobStorage.ExternalBlob;
  };

  public type UserProfileView = {
    name : Text;
    email : Text;
    phoneNumber : Text;
    addresses : [Address];
  };

  // Persistent data stores
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextBlogId = 1;

  let products = Map.empty<Text, Product>();
  let profiles = Map.empty<Principal, UserProfile>();
  let orders = Map.empty<Text, Order>();
  let blogs = Map.empty<Text, BlogPost>();
  let categoryIndex = Map.empty<MedicineCategory, Set.Set<Text>>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper Functions
  func generateId(prefix : Text, counter : Nat) : Text {
    prefix # "_" # counter.toText() # "_" # Time.now().toText();
  };

  // Product Management
  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Float, category : MedicineCategory, requiresPrescription : Bool, stockStatus : Bool, imageUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let id = generateId("product", nextProductId);
    nextProductId += 1;

    let newProduct = {
      id;
      name;
      description;
      price;
      category;
      requiresPrescription;
      stockStatus;
      imageUrl;
    };

    products.add(id, newProduct);

    switch (categoryIndex.get(category)) {
      case (null) {
        let newSet = Set.empty<Text>();
        newSet.add(id);
        categoryIndex.add(category, newSet);
      };
      case (?existingSet) {
        existingSet.add(id);
      };
    };

    id;
  };

  public shared ({ caller }) func updateProduct(id : Text, name : Text, description : Text, price : Float, category : MedicineCategory, requiresPrescription : Bool, stockStatus : Bool, imageUrl : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct = {
          id;
          name;
          description;
          price;
          category;
          requiresPrescription;
          stockStatus;
          imageUrl;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        products.remove(id);
        switch (categoryIndex.get(product.category)) {
          case (null) {};
          case (?categorySet) {
            categorySet.remove(id);
          };
        };
      };
    };
  };

  public query ({ caller }) func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func searchProducts(keyword : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) {
        p.name.contains(#text keyword) or p.description.contains(#text keyword);
      }
    );
  };

  // Category Management
  public query ({ caller }) func getProductsByCategory(category : MedicineCategory) : async [Product] {
    let filtered = products.values().toArray().filter(func(p) { p.category == category });
    filtered;
  };

  public query ({ caller }) func getCategoryIndex() : async [(MedicineCategory, [Text])] {
    categoryIndex.toArray().map(
      func((cat, set)) {
        let idIter = set.values();
        (cat, idIter.toArray());
      }
    );
  };

  // User Profile Management
  public shared ({ caller }) func saveCallerUserProfile(name : Text, email : Text, phoneNumber : Text) : async () {
    let emptyAddresses = List.empty<Address>();
    let newProfile = {
      name;
      email;
      phoneNumber;
      addresses = emptyAddresses;
    };
    profiles.add(caller, newProfile);
  };

  public shared ({ caller }) func addAddress(address : Address) : async () {
    let userProfile = getProfileOrTrap(caller);
    userProfile.addresses.add(address);
  };

  public shared ({ caller }) func updateAddress(oldAddress : Address, newAddress : Address) : async () {
    let userProfile = getProfileOrTrap(caller);
    let iter = userProfile.addresses.values();
    let filtered = List.empty<Address>();

    for (address in iter) {
      if (not addressesEqual(address, oldAddress)) {
        filtered.add(address);
      };
    };

    userProfile.addresses.clear();
    userProfile.addresses.addAll(filtered.values());
    userProfile.addresses.add(newAddress);
  };

  public shared ({ caller }) func deleteAddress(address : Address) : async () {
    let userProfile = getProfileOrTrap(caller);
    let iter = userProfile.addresses.values();
    let filtered = List.empty<Address>();

    for (addr in iter) {
      if (not addressesEqual(addr, address)) {
        filtered.add(addr);
      };
    };

    userProfile.addresses.clear();
    userProfile.addresses.addAll(filtered.values());
  };

  func addressesEqual(a1 : Address, a2 : Address) : Bool {
    a1.addressLabel == a2.addressLabel and a1.address == a2.address and a1.city == a2.city and a1.pincode == a2.pincode
  };

  // Order Management
  public shared ({ caller }) func placeOrder(items : [OrderItem], deliveryAddress : Text, paymentMethod : PaymentMethod, prescription : ?BlobStorage.ExternalBlob) : async Text {
    let totalAmount = calculateTotalAmount(items);

    let orderItems = List.fromArray<OrderItem>(items);
    let newOrder = {
      id = generateId("order", nextOrderId);
      customerId = caller;
      items = orderItems;
      deliveryAddress;
      status = #received;
      timestamp = Time.now();
      totalAmount;
      paymentMethod;
      prescription;
    };

    orders.add(newOrder.id, newOrder);
    nextOrderId += 1;
    newOrder.id;
  };

  func calculateTotalAmount(items : [OrderItem]) : Float {
    var total : Float = 0.0;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) {};
        case (?product) {
          total += product.price * item.quantity.toFloat();
        };
      };
    };
    total;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Conversion Functions
  func toOrderView(order : Order) : OrderView {
    {
      order with
      items = order.items.toArray()
    };
  };

  func toUserProfileView(profile : UserProfile) : UserProfileView {
    {
      profile with
      addresses = profile.addresses.toArray()
    };
  };

  // Public Queries
  public query ({ caller }) func getOrder(orderId : Text) : async ?OrderView {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) { ?toOrderView(order) };
    };
  };

  public query ({ caller }) func getUserOrders() : async [OrderView] {
    let filtered = orders.values().toArray().filter(
      func(order) { order.customerId == caller }
    );
    filtered.map(func(order) { toOrderView(order) });
  };

  public query ({ caller }) func getUserProfile() : async UserProfileView {
    toUserProfileView(getProfileOrTrap(caller));
  };

  // Blog Management
  public shared ({ caller }) func createBlogPost(title : Text, content : Text, category : Text, author : Text, coverImageUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create blogs");
    };

    let blogPost = {
      id = generateId("blog", nextBlogId);
      title;
      content;
      category;
      author;
      coverImageUrl;
      status = false; // draft by default
      createdAt = Time.now();
    };

    blogs.add(blogPost.id, blogPost);
    nextBlogId += 1;
    blogPost.id;
  };

  public shared ({ caller }) func updateBlogPost(blogId : Text, title : Text, content : Text, category : Text, author : Text, coverImageUrl : Text) : async () {
    switch (blogs.get(blogId)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = {
          post with
          title;
          content;
          category;
          author;
          coverImageUrl;
        };
        blogs.add(blogId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deleteBlogPost(blogId : Text) : async () {
    switch (blogs.get(blogId)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?_) {
        blogs.remove(blogId);
      };
    };
  };

  public shared ({ caller }) func publishBlogPost(blogId : Text) : async () {
    switch (blogs.get(blogId)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = { post with status = true };
        blogs.add(blogId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func unpublishBlogPost(blogId : Text) : async () {
    switch (blogs.get(blogId)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) {
        let updatedPost = { post with status = false };
        blogs.add(blogId, updatedPost);
      };
    };
  };

  public query ({ caller }) func getPublishedBlogPosts() : async [BlogPost] {
    blogs.values().toArray().filter(func(p) { p.status });
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    blogs.values().toArray();
  };

  public query ({ caller }) func getBlogPost(blogId : Text) : async ?BlogPost {
    blogs.get(blogId);
  };

  public query ({ caller }) func getBlogPostsByCategory(category : Text) : async [BlogPost] {
    blogs.values().toArray().filter(
      func(p) { p.category == category and p.status }
    );
  };

  // Helper Functions
  func getProfileOrTrap(userId : Principal) : UserProfile {
    switch (profiles.get(userId)) {
      case (null) { Runtime.trap("UserProfile not found for user: " # userId.toText()) };
      case (?profile) { profile };
    };
  };
};
