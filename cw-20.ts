import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import * as fs from "fs";

const rpcEndpoint = "http://localhost:26657";

// Example user from scripts/wasmd/README.md
const riz = {
  mnemonic: "common tomorrow rather flash novel disagree maximum embody evidence bitter tornado menu excite weasel select strong permit journey shift cart confirm gain clerk expose",
  address0: "vibe17fertps4ggnxurcly4w7fzsr77pna8ww8afwfg",
};

async function main(hackatomWasmPath: string) {
  const gasPrice = GasPrice.fromString("0.025vibe");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(riz.mnemonic, { prefix: "vibe" });
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);
  // Upload contract
  const wasm = fs.readFileSync(hackatomWasmPath);
  const uploadFee = calculateFee(100_000_000, gasPrice);
  const uploadReceipt = await client.upload(riz.address0, wasm, uploadFee, "Upload hackatom contract");


  console.info("Upload succeeded. Receipt:", uploadReceipt);
  // Instantiate
  const instantiateFee = calculateFee(500_000, gasPrice);
  // This contract specific message is passed to the contract
  const msg ={
    name: "Golden Stars",
    symbol: "STAR",
    decimals: 2,
    // list of all validator self-delegate addresses - 100 STARs each!
    initial_balances: [
      {address: "vibe17fertps4ggnxurcly4w7fzsr77pna8ww8afwfg", amount: "10000"},
      {address: "vibe189hchgqqw4uae794p3zhrr3r2akjyazwayxjs8", amount: "10000"},
      {address: "vibe15p4m9vcddk8cegws2nztgx8vrkezdxdfl4pvfj", amount: "10000"},
    ],
    mint: {
      minter: riz.address0,
    },
  };

  const { contractAddress } = await client.instantiate(
    riz.address0,
    uploadReceipt.codeId,
    msg,
    "My instance",
    instantiateFee,
    { memo: `Create a hackatom instance` },
  );
  console.info(`Contract instantiated at: `, contractAddress);


}

const repoRoot = process.cwd() + "/../.."; // This assumes you are in `packages/cli`
const hackatom = `./cw20_base.wasm`;
main(hackatom);
console.info("The show is over.");