//kopplar till DOMen
const loanAmountInput = document.getElementById('loan-amount') as HTMLInputElement;
const interestRateInput = document.getElementById('interest-rate') as HTMLInputElement;
const loanPeriodInput = document.getElementById('loan-period') as HTMLInputElement;
const calculateBtn = document.getElementById('calculate') as HTMLButtonElement;
const payPlan = document.getElementById('pay-plan') as HTMLHeadingElement;
const monthsDiv = document.getElementById('months-div') as HTMLDivElement;
const monthlyPaymentsDiv = document.getElementById('monthly-payment-div') as HTMLDivElement;
const monthlyInterestDiv = document.getElementById('monthly-interest-div') as HTMLDivElement;
const remainingAmountDiv = document.getElementById('remaining-amount-div') as HTMLDivElement;
const totalResults = document.getElementById('total-results') as HTMLParagraphElement;

calculateBtn.addEventListener('click', () => {   
    //återställer divar
    monthsDiv.innerHTML = `<h3>Date</h3>`; 
    monthlyPaymentsDiv.innerHTML = `<h3>Payment</h3>`;
    remainingAmountDiv.innerHTML = `<h3>Remaining Amount</h3>`;
    monthlyInterestDiv.innerHTML = `<h3>Monthly Interest<h3>`;
    totalResults.innerHTML = '';

    //hämta alla värden - parseInt för att få numbers
    let interestRate: number = parseInt(interestRateInput.value); //ger antal %
    let loanPeriod: number = parseInt(loanPeriodInput.value); // ger antal år
    let totalLoan: number = parseInt(loanAmountInput.value); //ger totala beloppet för att addera med total ränta

    let loanAmountValue: number = parseInt(loanAmountInput.value); //ger värdet P
    let monthlyInterest: number = (interestRate / 100) / 12; //ger värdet R
    let numberOfMonths: number = loanPeriod * 12; // ger värdet N

    let totalInterest: number = 0;
    let totalPayment: number = 0;
    let monthlyPayment: number = 0;

    //testar att lånevilkoren är 'rimliga'
    if (interestRate > 10 && loanPeriod >= 50) {
        payPlan.innerHTML = `
        An interest rate of ${interestRate}% with a loan period of ${loanPeriod} years is completely unreasonable!! <br> 
        Renegotiate with a bank that won't scam you!`;
    } else if (interestRate > 10) {
        payPlan.innerHTML = `
        An interest rate of ${interestRate}% is bonkers!! <br>
        You are getting ripped off!!!`;
    } else if (loanPeriod >= 50) {
        payPlan.innerHTML = `
        A loan period of ${loanPeriod} years is bonkers!! <br> 
        You won't live that long!!!`;
    } else {
        payPlan.innerHTML = 'Payment Plan';
        const currentDate: Date = new Date(); // hämtar dagens datum
        //beräknar månadens betalning genom att anropa beräkningen
        monthlyPayment = calculateLoan(loanAmountValue, monthlyInterest, numberOfMonths);
        console.log(monthlyPayment);
        //loopar så genom hela lånets längd (antal månader substraheras varje körning)
        for (let i = 1; numberOfMonths > 0; i++) {
            const futureDate: Date = new Date(currentDate);
            futureDate.setMonth(currentDate.getMonth() + i); // Add lägger till i-antal månader till dagens datum

            let monthlyInterestAmount: number = loanAmountValue * monthlyInterest;  //beräknar månadens ränta - 
            loanAmountValue = loanAmountValue - (monthlyPayment- monthlyInterestAmount); //beräknar kvarstående belopp
            totalInterest += monthlyInterestAmount;//adderar till totala räntan att betala
    
            //uppdaterar varje kolumn med data
            monthsDiv.innerHTML += `${futureDate.toLocaleDateString()}<br>`;
            monthlyPaymentsDiv.innerHTML += `${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 }) } SEK<br>`
            monthlyInterestDiv.innerHTML += `${monthlyInterestAmount.toLocaleString('en-US', { maximumFractionDigits: 2 }) } SEK<br>`
            remainingAmountDiv.innerHTML += `${loanAmountValue.toLocaleString('en-US', { maximumFractionDigits: 2 }) } SEK<br>`

            numberOfMonths--; //antal månader subtraheras
    
            if (loanAmountValue < 0) {
                loanAmountValue = 0; // säkerställer att lånet inte går 'minus'
            }
        }
        //beräknar totala beloppet
        totalPayment= totalInterest + totalLoan;

        totalResults.innerHTML +=`
        Total Loan: ${totalLoan.toLocaleString('en-US', { minimumFractionDigits: 2 }) } SEK <br>
        Monthly Payment: ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 }) } SEK<br>
        Total Interest: ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 2 }) } SEK<br> 
        Total Payment: ${totalPayment.toLocaleString('en-US', { maximumFractionDigits: 2 }) } SEK`;
    }
    //töm inputs
    loanAmountInput.value = '';
    interestRateInput.value = '';
    loanPeriodInput.value = '';
});

const calculateLoan = (p: number, r: number, n: number): number => {
    //beräknar täljare och nämnare
    const numerator: number = p * r * Math.pow((1 + r), n);
    const denominator: number = Math.pow((1 + r), n) - 1;
    
    //beräknar och returnerar månadsbetalningen
    const monthlyPayment: number = numerator / denominator 
    return monthlyPayment;
};
