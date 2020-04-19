using Bridge.Html5;
using System;
using System.Collections.Generic;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class App
    {
        private readonly HTMLCanvasElement canvas;
        private readonly CanvasRenderingContext2D ctx;
        private readonly Random rnd = new Random();
        private readonly PixelScreen pixelScreen;
        private TreeSegment trunk;
        private readonly TreeDrawingContext treeDrawingContext;
        private readonly HTMLImageElement water;
        private readonly HTMLImageElement reset;

        private readonly RandomWrapper treeRndSource;
        private RandomWrapper grassRandom;

        private const int CanvasWidth = 512;
        private const int CanvasHeight = 512;
        private const double ScaleFactor = 80;
        private const int TreeYOffset = 420;

        public double GrowthControl { get; set; }
        public double WaterAmount { get; set; }
        public double ThicknessControl { get; set; }
        public double WaterDelta { get; set; }
        public bool IsDead { get; set; }

        private string SkyColor => IsDead ? "#444" : "#B2FFFF";
        private string GrassBackgroundColor => IsDead ? "#333" : "#7EC850";
        private string GrassColor => IsDead ? "#111" : "#206411";

        public App(HTMLCanvasElement canvas, HTMLImageElement water, HTMLImageElement reset, int seed)
        {
            this.canvas = canvas;
            this.water = water;
            this.reset = reset;
            canvas.Width = CanvasWidth;
            canvas.Height = CanvasHeight;

            pixelScreen = new PixelScreen();

            ctx = canvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);

            pixelScreen.SetPixel(0, 0, true);

            //for (var y = 0; y < pixelScreen.Height; y++)
            //{
            //    for (var x = 0; x < pixelScreen.Width; x++)
            //    {
            //        pixelScreen.SetPixel(x, y, true);
            //    }
            //}

            //ctx.PutImageData(pixelScreen.ImageData, 0, 0);



            UpdateSeed(seed);

            treeDrawingContext = new TreeDrawingContext(ctx)
            {
                ScaleFactor = ScaleFactor,
                StartX = CanvasWidth / 2,
                StartY = TreeYOffset,
                LeafLimit = 0.02
            };
        }

        public void UpdateSeed(int newSeed)
        {
            var treeRndSource = new RandomWrapper(newSeed);
            var treeBuilder = new TreeBuilder(treeRndSource);
            trunk = treeBuilder.BuildTree();

            grassRandom = new RandomWrapper(newSeed);
        }

        private bool waterInfoWasShown = false;
        private bool waterInfoDeactivated = false;

        public void Redraw()
        {
            grassRandom.Reset();

            ctx.FillStyle = SkyColor;
            ctx.ClearRect(0, 0, 512, 512);
            ctx.FillRect(0, 0, 512, 512);

            treeDrawingContext.GrowthFactor = EasingHelper.EaseOutQuad(GrowthControl * 0.75 + 0.25);
            treeDrawingContext.LeafFactor = ThicknessControl * 0.9;
            treeDrawingContext.IsDead = IsDead;

            var grassHeight = TreeYOffset - 50;
            ctx.FillStyle = GrassBackgroundColor;
            ctx.FillRect(0, grassHeight, CanvasWidth, CanvasHeight - grassHeight);

            var grassForegroundLimit = TreeYOffset - 20;

            for (var y = grassHeight - 10; y < grassForegroundLimit; y += 5)
            {
                DrawGrass(y, 512);
            }

            treeDrawingContext.DrawTree(trunk);

            for (var y = grassForegroundLimit; y < CanvasHeight; y += 5)
            {
                DrawGrass(y, 512);
            }

            DrawWaterHUD();
        }

        private void DrawWaterHUD()
        {
            // draw hud
            var height = 30;
            var margin = 10;
            var marginLeft = 50;
            var marginBottom = 20;
            var padding = 5;

            var waterPredition = 0;

            if (WaterAmount + WaterDelta > 1)
            {
                waterPredition = 1;
            }

            if (!IsDead)
            {
                // white hud bg
                ctx.FillStyle = "#B2FFFF60";
                ctx.FillRect(0 + marginLeft, CanvasHeight - marginBottom - 2 * padding - height, CanvasWidth - margin - marginLeft, height + 2 * padding);

                ctx.FillStyle = "#0077BE80";
                ctx.FillRect(0 + marginLeft + padding, CanvasHeight - marginBottom - padding - height, (CanvasWidth - 2 * padding - margin - marginLeft) * waterPredition, height);

                ctx.FillStyle = "#0077BE";
                ctx.FillRect(0 + marginLeft + padding, CanvasHeight - marginBottom - padding - height, (int)((CanvasWidth - 2 * padding - margin - marginLeft) * WaterAmount), height);
            }

            var icon = water;
            var iconLeft = 5;

            if (IsDead)
            {
                iconLeft = 20;
                icon = reset;
            }

            ctx.ImageSmoothingEnabled = true;
            ctx.DrawImage(icon, iconLeft, CanvasHeight - 64 - 15, 64d, 64d);

            ctx.FillStyle = "#000";
            ctx.Font = "bold 16px Arial, sans-serif";

            var text = "";

            if (!IsDead)
            {
                var lastWaterinfo = waterInfoWasShown;
                waterInfoWasShown = false;

                if ((WaterAmount < 0.5 && !waterInfoDeactivated) || WaterAmount < 0.001)
                {
                    text = "⯇ click to water your tree";
                    waterInfoWasShown = true;
                }
                else if (WaterAmount > 0.999)
                {
                    text = "swamped";
                }

                if (lastWaterinfo && !waterInfoWasShown)
                {
                    waterInfoDeactivated = true;
                }
            }
            else
            {
                ctx.Font = "bold 24px Arial, sans-serif";
                marginLeft += 30;
                //text = "⯇ click to restart";
            }

            ctx.FillText(text, marginLeft + padding + 15, CanvasHeight - marginBottom - padding - 10);
        }

        private void DrawGrass(int y, int amount)
        {
            var grassScale = 0.2 * ScaleFactor;

            ctx.StrokeStyle = GrassColor;
            ctx.LineWidth = grassScale * 0.025;

            ctx.BeginPath();

            for (var i = 0; i < amount; i++)
            {

                var x = grassRandom.NextDouble() * CanvasWidth;

                var offsetx = grassRandom.NextDouble() - 0.5;
                var offsetY = grassRandom.NextDouble() - 0.5;
                var height = grassRandom.NextDouble() * 0.7 + 0.3;

                ctx.MoveTo(x, y + offsetY * grassScale);
                ctx.LineTo(x + offsetx * grassScale, y + offsetY * grassScale + height * grassScale);
            }

            ctx.ClosePath();
            ctx.Stroke();
        }
    }

    public static class EasingHelper
    {
        public static double EaseOutSine(double x)
        {
            return Math.Sin(x * Math.PI / 2);
        }

        public static double EaseOutQuad(double x)
        {
            return 1 - (1 - x) * (1 - x);
        }

        public static double EaseOutQuint(double x)
        {
            return 1 - Math.Pow(1 - x, 5);
        }

        public static double EaseInQuad(double x)
        {
            return x * x * x * x;
        }

        public static double EaseInQuadOffset(double x)
        {
            x = x * 0.5 + 0.5;
            return x * x * x * x;
        }

        public static double EaseLinear(double x)
        {
            return x;
        }

        public static double EaseInExp(double factor)
        {
            if (factor <= 0)
            {
                return 0;
            }

            return Math.Pow(2, 10 * factor - 10);
        }
    }

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
                ctx.StrokeStyle = BranchColor;
                ctx.FillStyle = BranchColor;
            }
            else
            {
                // leaf
                ctx.StrokeStyle = "#206411";
                ctx.FillStyle = "#206411";
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
            ctx.BeginPath();
            ctx.MoveTo(x, y);

            var dx = Math.Cos(absoluteAngle) * length * ScaleFactor;
            var dy = Math.Sin(absoluteAngle) * length * ScaleFactor;

            x += dx;
            y += -dy;

            ctx.LineTo(x, y);
            ctx.LineWidth = thickness * ScaleFactor;
            ctx.ClosePath();

            ctx.Stroke();

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

                ctx.BeginPath();
                ctx.MoveTo(x + oldNormalX * ScaleFactor, y + oldNormalY * ScaleFactor);
                ctx.LineTo(newX - newNormalX * ScaleFactor, newY - newNormalY * ScaleFactor);
                ctx.LineTo(newX + newNormalX * ScaleFactor, newY + newNormalY * ScaleFactor);
                ctx.LineTo(x - oldNormalX * ScaleFactor, y - oldNormalY * ScaleFactor);

                ctx.ClosePath();

                //ctx.Stroke();
                ctx.Fill();

                ctx.BeginPath();
                ctx.Arc(newX, newY, thickness / 2 * ScaleFactor, 0, TAU);
                ctx.ClosePath();
                ctx.Fill();

            }
            else
            {
                ctx.BeginPath();

                ctx.MoveTo(x, y);
                ctx.LineTo(newX, newY);
                ctx.LineWidth = thickness * ScaleFactor;

                ctx.ClosePath();
                ctx.Stroke();
            }

            return (newX, newY);
        }
    }

    public class PixelScreenSegmentWriter : IPixelScreenWriter
    {
        public PixelScreenSegmentWriter(IPixelScreenWriter pixelScreenWriter)
        {

        }

        public void SetPixel(int x, int y, bool set)
        {
            throw new NotImplementedException();
        }
    }

    public class PixelScreen
    {
        public PixelScreen()
        {
            ImageData = new ImageData((uint)Width, (uint)Height);

            // Set alpha channel to visible and pixel to white;
            for (var i = 0; i < ImageData.Data.Length; i += 4)
            {
                ImageData.Data[i + 0] = 255;
                ImageData.Data[i + 1] = 255;
                ImageData.Data[i + 2] = 255;
                ImageData.Data[i + 3] = 255;
            }
        }

        public int Width => 64;
        public int Height => 64;

        public ImageData ImageData { get; }

        public void SetPixel(int x, int y, bool set)
        {
            if (x < 0 || x >= Width || y < 0 || y >= Height)
            {
                return;
            }

            var value = set ? (byte)0 : (byte)255;
            var arrayPosition = (y * Width + x) * 4;

            // Set RGB to same color (black & white only)
            ImageData.Data[arrayPosition + 0] = value;
            ImageData.Data[arrayPosition + 1] = value;
            ImageData.Data[arrayPosition + 2] = value;
        }
    }
}
