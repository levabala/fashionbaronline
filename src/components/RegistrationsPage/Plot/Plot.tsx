import { format } from 'date-fns';
import React, { useCallback, useState } from 'react';
import {
  CartesianGrid,
  LabelFormatter,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: Array<{
    time: Date;
    registrations: number;
    visits: number;
    subscriptions: number;
  }>;
}

const Plot = ({ data }: Props) => {
  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");

  const formatter = (time: number) => format(time, "d/M");
  const formatterTooltip: LabelFormatter = label => "Registrations";

  const dd = data.map(({ time, registrations, visits, subscriptions }) => ({
    registrations,
    subscriptions,
    time: time.valueOf(),
    visits
  }));

  const zoomOut = useCallback(() => {
    setLeft("dataMin");
    setRight("dataMax");
    setRefAreaLeft("");
    setRefAreaRight("");
  }, []);

  const zoom = useCallback(() => {
    console.log(refAreaLeft, refAreaRight);
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    if (refAreaLeft > refAreaRight) {
      zoomOut();
      return;
    }

    setLeft(refAreaLeft);
    setRight(refAreaRight);
    setRefAreaLeft("");
    setRefAreaRight("");
  }, [refAreaLeft, refAreaRight, zoomOut]);

  const onMouseDown = useCallback(({ activeLabel }) => {
    setRefAreaLeft(activeLabel);
  }, []);

  const onMouseMove = useCallback(
    ({ activeLabel }) => {
      if (refAreaLeft) setRefAreaRight(activeLabel);
    },
    [refAreaLeft]
  );

  const onMouseMoveOuter = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
    },
    []
  );

  const onMouseUp = zoom;

  return (
    <div onMouseMove={onMouseMoveOuter}>
      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          data={dd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <CartesianGrid />
          <XAxis
            allowDataOverflow
            dataKey="time"
            domain={[left, right]}
            tickFormatter={formatter}
            tickCount={10}
            type="number"
          />
          <YAxis
            allowDataOverflow={false}
            domain={["dataMin-1", "dataMax+1"]}
            yAxisId="1"
          />

          <Tooltip
            labelFormatter={formatterTooltip}
            animationDuration={300}
            animationEasing="ease-in-out"
          />

          <Line
            yAxisId="1"
            name="Visits"
            type="natural"
            dataKey="visits"
            stroke="darkblue"
            animationDuration={300}
            connectNulls
          />
          <Line
            yAxisId="1"
            name="Registrations"
            type="natural"
            dataKey="registrations"
            stroke="darkgreen"
            animationDuration={300}
            connectNulls
          />
          <Line
            yAxisId="1"
            name="Subscriptions"
            type="natural"
            dataKey="subscriptions"
            stroke="grey"
            animationDuration={300}
            connectNulls
          />

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Plot;
