select * from customers;
Select Password from customers where EmailAddress = "poojitha.danda@gmail.com";
Select * from assets where Status = "open" and SellerCustomerId = 10;
Select * from bids;
Update assets set CurrentBidPrice = 4600000, BidderCustomerId = 15 where assetId = 5;
Update assets set Status = "closed" where assetId = 5;
Select * from assets;
Select CustomerId, Name, EmailAddress, PhoneNumber from customers where EmailAddress = "poojitha.danda@gmail.com";
Update assets set Status = "closed" where assetId = 103;
select * from customers where EmailAddress = 'vamsikris.83@gmail.com' or PhoneNumber = '7306004129';
select * from customers where EmailAddress = "mamatha.dhanda@gmail.com" or PhoneNumber = "300004050";

select * from assets where AssetType = "Flat" and MinAuctionPrice = 250000;

select * from memberships;

INSERT INTO bids (AssetId, CustomerId, BidPrice) values (20, 20, '20000'); 

Update bids set AssetId = 22 where BidId = 21;
Select * from bids where AssetId = 15 and CustomerId = 15;

Select * from assets where Status = 'open';
select * from bids;

Update assets set CurrentBidPrice = '100000' , BidderCustomerId = 15 where Status = "open" and assetId = 12 and CAST(MinAuctionPrice as SIGNED) < 100000;
