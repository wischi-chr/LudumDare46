using System;

namespace Wischi.LD46.KeepItAlive
{
    public struct Vector2D
    {
        public Vector2D(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; }
        public double Y { get; }
        public double Length => Math.Sqrt(X * X + Y * Y);

        public Vector2D Rotate(double radianAngle)
        {
            var cosAngle = Math.Cos(radianAngle);
            var sinAngle = Math.Sin(radianAngle);

            var x = cosAngle * X - sinAngle * Y;
            var y = sinAngle * X + cosAngle * Y;

            return new Vector2D(x, y);
        }

        public Vector2D ChangeLength(double newLength)
        {
            var len = Length;

            var normalizedX = X / len;
            var normalizedY = Y / len;

            return new Vector2D(normalizedX * newLength, normalizedY * newLength);
        }
    }
}
