const {ethers}=require("ethers");
const fs=require("fs-extra"); //to read abi and other dtuff from other files
require("dotenv").config();

async function main(){
    
    //set up connection using rpc url
    const provider =new ethers.providers.JsonRpcProvider(process.env.RPCURL);
    
    //set up truffle wallet/account
    const wallet= new ethers.Wallet(
        process.env.KEY,
        provider
    );
    //read abi and binary
    const abi=fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary=fs.readFileSync("./SimpleStorage_sol_SipmleStorage.bin", "utf8");
    
    //contract factory is obj used to deploy contract
    const contractFactory=new ethers.ContractFactory(abi,binary,wallet);
    console.log("Deploying contract, wait >>>>");
    //wait for deployment
    const contract=await contractFactory.deploy();
    // console.log(contract);
   
    console.log("Deployed transction: ");
    console.log( contract.deployTransaction);
    
    //transctionReceipt
    const transctionReceipt= await contract.deployTransaction.wait(1);
    console.log("Transction receipt: ");
    console.log(transctionReceipt);

//stuff from contract
//get fav no., update it, print new fav no.
    const currentFavoriteNumber= await contract.retrieve();
    console.log(currentFavoriteNumber);
    console.log(`current fav No. : ${currentFavoriteNumber.toString()}`);
    const transctionResponce= await contract.store("7");
    const updatedFavNumber= await contract.retrieve();
    console.log(`Updated fav No.: ${updatedFavNumber}`);
}

main().then(process.exit(0)).catch(
    (error)=>{
console.log(error);
process.exit(1);
    }
)