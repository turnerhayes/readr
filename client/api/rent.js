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
            payment.get("payments").reduce(
              (sum, payment) => sum + payment.get("paidAmount"),
              0
            )
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
    `Request to /api/rent/ returned with status ${response.status}`
  );
};

