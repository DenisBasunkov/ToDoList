
import styles from "./FormCard.module.scss"

export const FormCard = ({ isOpen, setIsOpen }) => {

    return <dialog open={isOpen} className={styles.Form_container}>
        <div>
            <img
                className={styles.btn_close}
                onClick={() => setIsOpen(false)}
                src="./Cancel.png" alt=""
            />
        </div>
    </dialog>

}