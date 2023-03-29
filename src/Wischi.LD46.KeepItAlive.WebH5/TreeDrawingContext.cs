using System;
using static H5.Core.dom;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeDrawingContext
    {
        private const double TAU = Math.PI * 2;

        private readonly CanvasRenderingContext2D ctx;

        public TreeDrawingContext(CanvasRenderingContext2D ctx)
        {
            this.ctx = ctx ?? throw new ArgumentNullException(nameof(ctx));
        }

        private int DepthLimit => 12;

        public double GrowthFactor { get; set; }
        public double ScaleFactor { get; set; }
        public double LeafLimit { get; set; }
        public double StartX { get; set; }
        public double StartY { get; set; }
        private double ThicknessLimit => LeafLimit * (1 - LeafFactor);
        public double LeafFactor { get; set; }
        public bool IsDead { get; set; }

        private string BranchColor => IsDead ? "#000" : "#421208";

        public void DrawTree(TreeSegment treeTrunk)
        {
            if (treeTrunk is null)
            {
                throw new ArgumentNullException(nameof(treeTrunk));
            }

            DrawSegmentInternal(treeTrunk, StartX, StartY, 0.25 * TAU, double.NaN);
        }

        private Func<double, double> EaseDepth => EasingHelper.EaseInQuadOffset;
        private Func<double, double> EaseThickness => EasingHelper.EaseInQuadOffset;
        private Func<double, double> EaseDeviation => EasingHelper.EaseLinear;

        private void DrawSegmentInternal(TreeSegment currentSegment, double x, double y, double lastBranchAbsoluteAngle, double lastThickness)
        {
            var floatingDepth = DepthLimit * EaseDepth(GrowthFactor);

            var lowerDepth = (int)floatingDepth;
            var upperDepth = lowerDepth + 1;

            if (currentSegment.Depth > upperDepth)
            {
                return;
            }

            var depthLengthScale = Math.Max(Math.Min(1.0, floatingDepth - currentSegment.Depth), 0);

            var effectiveDeviationAngle = currentSegment.DeviationAngle * (EaseDeviation(GrowthFactor) * 0.3 + 0.7);

            var currentBranchAbsoluteAngle = lastBranchAbsoluteAngle + effectiveDeviationAngle;
            var length = currentSegment.Length * GrowthFactor * depthLengthScale;

            var internalThickness = currentSegment.Thickness * GrowthFactor * EaseThickness(GrowthFactor) * depthLengthScale;

            if (internalThickness < ThicknessLimit)
            {
                return;
            }

            if (internalThickness > LeafLimit)
            {
                // branch
                ctx.strokeStyle = BranchColor;
                ctx.fillStyle = BranchColor;
            }
            else
            {
                // leaf
                ctx.strokeStyle = "#206411";
                ctx.fillStyle = "#206411";
            }

            if (double.IsNaN(lastThickness))
            {
                lastThickness = internalThickness;
            }

            (x, y) = DrawSegmentToCanvas2(
                x,
                y,
                internalThickness,
                currentBranchAbsoluteAngle,
                lastThickness,
                lastBranchAbsoluteAngle,
                length
            );

            foreach (var branch in currentSegment.Branches)
            {
                DrawSegmentInternal(branch, x, y, currentBranchAbsoluteAngle, internalThickness);
            }
        }

        private (double nextX, double nextY) DrawSegmentToCanvas(
            double x,
            double y,
            double thickness,
            double absoluteAngle,
            double previousThickness,
            double previousAngle,
            double length
        )
        {
            ctx.beginPath();
            ctx.moveTo(x, y);

            var dx = Math.Cos(absoluteAngle) * length * ScaleFactor;
            var dy = Math.Sin(absoluteAngle) * length * ScaleFactor;

            x += dx;
            y += -dy;

            ctx.lineTo(x, y);
            ctx.lineWidth = thickness * ScaleFactor;
            ctx.closePath();

            ctx.stroke();

            return (x, y);
        }

        private (double nextX, double nextY) DrawSegmentToCanvas2(
            double x,
            double y,
            double thickness,
            double absoluteAngle,
            double previousThickness,
            double previousAngle,
            double length
        )
        {
            var dx = Math.Cos(absoluteAngle) * length * ScaleFactor;
            var dy = Math.Sin(absoluteAngle) * length * ScaleFactor;

            var newX = x + dx;
            var newY = y - dy;

            if (thickness > LeafLimit)
            {
                // calc old attachpoints
                var oldNormal = previousAngle - TAU * 0.25;
                var oldNormalX = Math.Cos(oldNormal) * previousThickness / 2;
                var oldNormalY = -Math.Sin(oldNormal) * previousThickness / 2;

                // calc new attachpoints
                var newNormal = absoluteAngle + TAU * 0.25;
                var newNormalX = Math.Cos(newNormal) * thickness / 2;
                var newNormalY = -Math.Sin(newNormal) * thickness / 2;

                ctx.beginPath();
                ctx.moveTo(x + oldNormalX * ScaleFactor, y + oldNormalY * ScaleFactor);
                ctx.lineTo(newX - newNormalX * ScaleFactor, newY - newNormalY * ScaleFactor);
                ctx.lineTo(newX + newNormalX * ScaleFactor, newY + newNormalY * ScaleFactor);
                ctx.lineTo(x - oldNormalX * ScaleFactor, y - oldNormalY * ScaleFactor);

                ctx.closePath();

                //ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.arc(newX, newY, thickness / 2 * ScaleFactor, 0, TAU);
                ctx.closePath();
                ctx.fill();

            }
            else
            {
                ctx.beginPath();

                ctx.moveTo(x, y);
                ctx.lineTo(newX, newY);
                ctx.lineWidth = thickness * ScaleFactor;

                ctx.closePath();
                ctx.stroke();
            }

            return (newX, newY);
        }
    }
}
