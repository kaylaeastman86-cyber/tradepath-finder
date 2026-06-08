import { categories, states, trades } from "@/lib/catalog";
import weeklySourceCheck from "@/data/weekly-source-check.json";
import { TradePathApp } from "./tradepath-app";

export default function Home() {
  return <TradePathApp categories={categories} initialStates={states} initialTrades={trades} sourceAudit={weeklySourceCheck} />;
}
