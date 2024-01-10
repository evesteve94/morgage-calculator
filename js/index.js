"use strict";
//kopplar till DOMen
const loanAmountInput = document.getElementById('loan-amount');
const interestRateInput = document.getElementById('interest-rate');
const loanPeriodInput = document.getElementById('loan-period');
const calculateBtn = document.getElementById('calculate');
const payPlan = document.getElementById('pay-plan');
const monthsDiv = document.getElementById('months-div');
const monthlyPaymentsDiv = document.getElementById('monthly-payment-div');
const monthlyInterestDiv = document.getElementById('monthly-interest-div');
const remainingAmountDiv = document.getElementById('remaining-amount-div');
const totalResults = document.getElementById('total-results');
calculateBtn.addEventListener('click', () => {
    //återställer divar
    monthsDiv.innerHTML = `<h3>Date</h3>`;
    monthlyPaymentsDiv.innerHTML = `<h3>Payment</h3>`;
    remainingAmountDiv.innerHTML = `<h3>Remaining Amount</h3>`;
    monthlyInterestDiv.innerHTML = `<h3>Monthly Interest<h3>`;
    totalResults.innerHTML = '';
    //hämta alla värden - parseInt för att få numbers
    let interestRate = parseInt(interestRateInput.value); //ger antal %
    let loanPeriod = parseInt(loanPeriodInput.value); // ger antal år
    let totalLoan = parseInt(loanAmountInput.value); //ger totala beloppet för att addera med total ränta
    let loanAmountValue = parseInt(loanAmountInput.value); //ger värdet P
    let monthlyInterest = (interestRate / 100) / 12; //ger värdet R
    let numberOfMonths = loanPeriod * 12; // ger värdet N
    let totalInterest = 0;
    let totalPayment = 0;
    let monthlyPayment = 0;
    //testar att lånevilkoren är 'rimliga'
    if (interestRate > 10 && loanPeriod >= 50) {
        payPlan.innerHTML = `
        An interest rate of ${interestRate}% with a loan period of ${loanPeriod} years is completely unreasonable!! <br> 
        Renegotiate with a bank that won't scam you!`;
    }
    else if (interestRate > 10) {
        payPlan.innerHTML = `
        An interest rate of ${interestRate}% is bonkers!! <br>
        You are getting ripped off!!!`;
    }
    else if (loanPeriod >= 50) {
        payPlan.innerHTML = `
        A loan period of ${loanPeriod} years is bonkers!! <br> 
        You won't live that long!!!`;
    }
    else {
        payPlan.innerHTML = 'Payment Plan';
        const currentDate = new Date(); // hämtar dagens datum
        //beräknar månadens betalning genom att anropa beräkningen
        monthlyPayment = calculateLoan(loanAmountValue, monthlyInterest, numberOfMonths);
        console.log(monthlyPayment);
        //loopar så genom hela lånets längd (antal månader substraheras varje körning)
        for (let i = 1; numberOfMonths > 0; i++) {
            const futureDate = new Date(currentDate);
            futureDate.setMonth(currentDate.getMonth() + i); // Add lägger till i-antal månader till dagens datum
            let monthlyInterestAmount = loanAmountValue * monthlyInterest; //beräknar månadens ränta - 
            loanAmountValue = loanAmountValue - (monthlyPayment - monthlyInterestAmount); //beräknar kvarstående belopp
            totalInterest += monthlyInterestAmount; //adderar till totala räntan att betala
            //uppdaterar varje kolumn med data
            monthsDiv.innerHTML += `${futureDate.toLocaleDateString()}<br>`;
            monthlyPaymentsDiv.innerHTML += `${monthlyPayment.toFixed(2)} SEK<br>`;
            monthlyInterestDiv.innerHTML += `${monthlyInterestAmount.toFixed(2)} SEK<br>`;
            remainingAmountDiv.innerHTML += `${loanAmountValue.toFixed(2)} SEK<br>`;
            numberOfMonths--; //antal månader subtraheras
            if (loanAmountValue < 0) {
                loanAmountValue = 0; // säkerställer att lånet inte går 'minus'
            }
        }
        //beräknar totala beloppet
        totalPayment = totalInterest + totalLoan;
        totalResults.innerHTML += `
        Total Loan: ${totalLoan.toFixed(2)} SEK <br>
        Monthly Payment: ${monthlyPayment.toFixed(2)} SEK<br>
        Total Interest: ${totalInterest.toFixed(2)} SEK<br> 
        Total Payment: ${totalPayment.toFixed(2)} SEK`;
    }
    //töm inputs
    loanAmountInput.value = '';
    interestRateInput.value = '';
    loanPeriodInput.value = '';
});
const calculateLoan = (p, r, n) => {
    //beräknar täljare och nämnare
    const numerator = p * r * Math.pow((1 + r), n);
    const denominator = Math.pow((1 + r), n) - 1;
    //beräknar och returnerar månadsbetalningen
    const monthlyPayment = numerator / denominator;
    return monthlyPayment;
};
