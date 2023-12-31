
document.forms["checkoutForm"].addEventListener("submit", async (event) => {
    event.preventDefault();
    const paymentType = $('input[name=paymentType]:checked', '#checkoutForm').val()
    data = new URLSearchParams(new FormData(event.target))
    if (paymentType == "cod") {
        checkout(data)
    } else {
        razorpay(orderId, amount)
    }
});


async function checkout(data) {
    try {
        const response = await axios({
            url: '/user/checkout',
            method: "post",
            data: data,
        });
        if (response.status == 201) {
            await Swal.fire({
                title: 'Congrats!',
                text: 'Order Successful',
                icon: 'success',
                confirmButtonColor: '#273952',
                width: "25em",
                timer: 3000
            })
            window.location = "/user/myOrders"
        }
    } catch (err) {
        console.error(err)
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            confirmButtonColor: '#273952',
            width: "25em",
            timer: 3000
        })
        window.location = "/user/checkout"
    }
}


// dom manipulation for saved address
function fillForm(address, index) {
    let myAddress = JSON.parse(address)
    $("#addressInputField :input").prop("disabled", true)
    $("#new-address").prop("disabled", false)
    $("#new-address").prop("checked", false)
    $("#address-index").prop("disabled", false)

    $("#address-index").val(index)
    $("[name='firstName']").val(myAddress.firstName)
    $("[name='lastName']").val(myAddress.lastName)
    $("[name='house']").val(myAddress?.house)
    $("[name='address']").val(myAddress.address)
    $("[name='city']").val(myAddress.city)
    $("[name='state']").val(myAddress.state)
    $("[name='pincode']").val(myAddress.pincode)
    $("[name='phone']").val(myAddress.phone)

}

function handleChange(checkbox) {
    if (checkbox.checked == true) {
        $("#addressInputField :input").not("[name=email]").prop("disabled", false)
        $("#addressInputField :input").not("[name=newAddress]").val('')
    }
}

async function removeAddress(index) {
    try {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6F7E8B',
            cancelButtonColor: '#273952',
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: 'No.',
            width: '25em'
        })
        if (result.isConfirmed) {
            const response = await axios.delete(`/user/deleteAddress/${index}`)
            if (response.status == 204) {
                document.getElementById(`address-${index}`).remove()
                toastr.options = {
                    "positionClass": "toast-bottom-right"
                }
                toastr.success('address removed successfully.')
            }
        }
    } catch (error) {
        console.error(err)
    }
}


