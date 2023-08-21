export default function useCalcTimeDiff(t1, t2) {
    let diff = Math.abs(new Date(t2) - new Date(t1)); // ms
    return Math.floor((diff / 1000) / 60); // mins
}