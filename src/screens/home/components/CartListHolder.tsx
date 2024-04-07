import { CartItem } from "./CartItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetIcon } from "../../../shared/icon/GetIcon";
import { AppButton } from "../../../shared/appbtn/AppButton";
import { useAppStorage } from "../../../shared/hooks/useAppStorage";
import { addToCartList, toggleCartListHolder } from "../../../utilis/redux/actions/ReduxActions";

export const CartListHolder: React.FC<{
    CartList: TProduct[],
    Status: boolean,
    removeItem: (element: TProduct) => void
}> = ({ CartList, Status, removeItem }): JSX.Element => {
    const dispatch = useDispatch();
    const { removeCartList } = useAppStorage();

    const [TotalPrice, setTotalPrice] = useState<number>(0);

    const CartProductsList: TProduct[] = useSelector((state: any) => state.allReducers.CartProductsList);

    const handleHolderStatus = () => {
        dispatch(toggleCartListHolder(false));
    }

    const handleCheckOut = () => {
        dispatch(addToCartList([]));
        removeCartList();
        handleHolderStatus();
    }

    const getTotalPrice = () => {
        let total = 0;

        if (CartProductsList.length > 0)
            CartProductsList?.forEach((el: TProduct) => total += el.price);


        setTotalPrice(total);

    };

    const updatePrice = (product: TProduct, price: number, counter: number) => {
        const list = [...CartProductsList]

        list.forEach((item, index) => {
            if (item.id == product.id) {
                const updateItem = { ...item, price: price * counter }
                list[index] = updateItem
            }
        });

        dispatch(addToCartList(list));

        getTotalPrice()

    }

    useEffect(() => {
        getTotalPrice();
    }, [CartProductsList, CartList]);

    return <div className={!Status ? "cart-list-holder" : "cart-list-holder cart-list-holder-active"}>
        <div className="holder-header">
            <h6>Selected Product(s)</h6>
            <span onClick={handleHolderStatus}><GetIcon Name="bi-x-circle" /></span>
        </div>

        <div className="holder-body">
            {CartProductsList?.length > 0 && CartProductsList?.map((item: TProduct, index) => {
                return <CartItem updatePrice={updatePrice} Product={item} key={index} removeItem={removeItem} />
            })}
        </div>
        <div className="holder-footer">
            <div className="totals">
                <h6>Subtotal: R{TotalPrice.toFixed(2)}</h6>
            </div>
            <AppButton ButtonName="Checkout" handleBtnClick={handleCheckOut} IconName="bi-basket" />
        </div>
    </div>
}