export default function Brands(props){
    return (
        <section className="brands">
            <div>
                <img src={props.url} alt={props.brandName} className="brand-img" />
            </div>
        </section>
    )
}