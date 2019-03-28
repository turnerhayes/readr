import { OrderedMap, fromJS } from "immutable";

export const getRentPayments = async () => {
  const response = await fetch("/api/rent/");

  if (!response.ok) {
    throw new Error("Error getting rent payments");
  }

  if (response.status < 300) {
    const json = await response.json();

    return OrderedMap().withMutations(
      (payments) => {
        const orderedDueDates = Object.keys(json).sort();

        for (const dueDate of orderedDueDates) {
          let payment = fromJS(json[dueDate]);

          payment = payment.set(
            "totalPayment",
            payment.get("payments") ?
              payment.get("payments").reduce(
                (sum, payment) => sum + payment.get("paidAmount"),
                0
              ) :
              null
          );

          payments.set(
            dueDate,
            payment,
          );
        }
      }
    );
  }

  throw new Error(
    `GET Request to /api/rent/ returned with status ${response.status}`
  );
};

export const addRentPayment = async ({ paidDate, paidAmount, dueDate }) => {
  const response = await fetch(
    "/api/rent/",
    {
      method: "post",
      body: JSON.stringify({
        paidDate,
        paidAmount,
        dueDate,
      }),
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error adding rent payment");
  }

  if (response.status < 300) {
    return;
  }

  throw new Error(
    `POST Request to /api/rent/ returned with status ${response.status}`
  );
};

