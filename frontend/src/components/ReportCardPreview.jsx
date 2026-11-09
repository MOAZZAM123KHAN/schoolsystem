import { useLayoutEffect, useRef, useState } from "react";
import ReportCard from "./ReportCard";

/**
 * Shows one report card shrunk to fit the screen (works on a phone too).
 * The card itself is always full A4 size; only the preview is scaled.
 * Props: student, subjects, school, allStudents
 */
export default function ReportCardPreview({ student, subjects, school, allStudents }) {
  const wrapRef = useRef(null);
  const boxRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const fit = () => {
      const card = boxRef.current?.firstElementChild;
      if (!card) return;
      const k = Math.min(1, (wrap.clientWidth - 24) / card.offsetWidth);
      setScale(k);
      setHeight(card.offsetHeight * k + 24);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [student?.id]);

  if (!student) {
    return <p className="text-slate-500">No students to show.</p>;
  }

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden rounded-md bg-slate-300 p-3"
      style={height ? { height } : undefined}
    >
      <div ref={boxRef} style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <ReportCard student={student} subjects={subjects} school={school} allStudents={allStudents} />
      </div>
    </div>
  );
}

