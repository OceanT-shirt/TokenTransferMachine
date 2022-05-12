declare let window: any;
import {createContext, useContext, useState} from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";


interface DataContextProps {
    account: string;
    loading: boolean;
    loadWallet: () => Promise<void>;
    sendPayment: ({
        amount,
        toAddress,
    }: {
        amount: any;
        toAddress: any;
    }) => Promise<any>;
    balance: number;
}

const DataContext = createContext<DataContextProps|null>(null);

export const DataProvider: React.FC = ({children}) => {
    const data = useProviderData();

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps | null>(DataContext);

export const useProviderData = () => {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<string>();
    const [paymentToken, setPaymentToken] = useState<any>();
    const [balance, setBalance] = useState<number>();

    const loadWallet = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            console.log("ethereum enabled")
            const web3 = window.web3;
            var allAccounts = await web3.eth.getAccounts();
            setAccount(allAccounts[0]);
            console.log("current account:", account);

            // const paymentTokenData = PaymentToken.networks["80001"];
            const paymentTokenData = "I don't use this constant";
            if (paymentTokenData) {
                var paymentTokenInstance = new web3.eth.Contract(
                    Token, // payment contract interface
                    "0x8A41f67ef9332f58c93280D57870fD4E52826Da7" // called payment contract data
                );
                setPaymentToken(paymentTokenInstance);
                var bal = await paymentTokenInstance.methods
                    .balanceOf(allAccounts[0])
                    .call();
                setBalance(bal);
            } else {
                window.alert("Network Not Found");
            }
            setLoading(false);
        } else {
            window.alert("Non-Eth browser detected. Please consider using MetaMask.")
        }
    };

    const sendPayment = async ({amount, toAddress}) => {
        try {
            const amountInWei = window.web3.utils.toWei(amount, "ether");
            var bal = await paymentToken.methods.balanceOf(account).call();
            if (bal < amountInWei) {
                return "You do not have enough balance";
            }
            const txHash = await paymentToken.methods
                .transfer(toAddress, amountInWei)
                .send({
                    from: account,
                });
            var bal = await paymentToken.methods.balanceOf(account).call();
            setBalance(bal);
            return "Payment success";
        } catch (e) {
            return e.message;
        }
    };

    return {
        account,
        loading,
        loadWallet,
        sendPayment,
        balance,
    };
}