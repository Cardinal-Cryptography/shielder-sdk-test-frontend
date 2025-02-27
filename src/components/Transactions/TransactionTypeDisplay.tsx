import { TransactionType } from "./types";
import { ArrowDownLeft, ArrowUpRight, User } from "lucide-react";
import { ReactNode } from "react";

interface TransactionTypeIconProps {
  type: string;
}

export const TransactionTypeIcon = ({
  type,
}: TransactionTypeIconProps): ReactNode => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return <ArrowDownLeft className="text-green-500" />;
    case TransactionType.WITHDRAW:
      return <ArrowUpRight className="text-red-500" />;
    case TransactionType.NEW_ACCOUNT:
      return <User className="text-blue-500" />;
    default:
      return null;
  }
};

interface TransactionTypeLabelProps {
  type: string;
}

export const TransactionTypeLabel = ({
  type,
}: TransactionTypeLabelProps): ReactNode => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return <span className="text-green-500">Deposit</span>;
    case TransactionType.WITHDRAW:
      return <span className="text-red-500">Withdraw</span>;
    case TransactionType.NEW_ACCOUNT:
      return <span className="text-blue-500">New Account</span>;
    default:
      return null;
  }
};
