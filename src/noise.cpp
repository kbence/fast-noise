#include <v8.h>
#include <node.h>

#define REQ_INT_ARG(I, VAR)                                             \
  int VAR;                                                              \
  if (args.Length() <= (I) || !args[I]->IsInt32())                      \
    return ThrowException(Exception::TypeError(                         \
                  String::New("Argument " #I " must be an integer")));  \
  VAR = args[I]->Int32Value()

#define REQ_DOUBLE_ARG(I, VAR)                                        \
  double VAR;                                                            \
  if (args.Length() <= (I) || !args[I]->IsNumber())                   \
    return ThrowException(Exception::TypeError(                       \
                  String::New("Argument " #I " must be a number")));  \
  VAR = args[I]->NumberValue()

using namespace v8;
using namespace node;

const int X_NOISE_GEN = 1619;
const int Y_NOISE_GEN = 31337;
const int Z_NOISE_GEN = 6971;
const int SEED_NOISE_GEN = 1013;

const int NOISE_MASK = 0x7fffffff;

int noiseImpl(int x, int y, int z, int seed)
{
	int n = (
	    X_NOISE_GEN    * x
	  + Y_NOISE_GEN    * y
	  + Z_NOISE_GEN    * z
	  + SEED_NOISE_GEN * seed) & NOISE_MASK;

   n = (n >> 13) ^ n;

   return (n * (n * n * 60493 + 19990303) + 1376312589) & NOISE_MASK;
}

double lerp(double a, double b, double w)
{
	return (1 - w) * a + w * b;
}

double smooth(double x)
{
	return 3*x*x - 2*x*x*x;
}

Handle<Value> noise1(const Arguments& args)
{
	HandleScope scope;

	REQ_INT_ARG(0, seed);
	REQ_INT_ARG(1, x);

	return scope.Close(Int32::New(noiseImpl(x, 0, 0, seed)));
}

Handle<Value> noise2(const Arguments& args)
{
	HandleScope scope;

	REQ_INT_ARG(0, seed);
	REQ_INT_ARG(1, x);
	REQ_INT_ARG(2, y);

	return scope.Close(Int32::New(noiseImpl(x, y, 0, seed)));
}

Handle<Value> noise3(const Arguments& args)
{
	HandleScope scope;

	REQ_INT_ARG(0, seed);
	REQ_INT_ARG(1, x);
	REQ_INT_ARG(2, y);
	REQ_INT_ARG(3, z);

	return scope.Close(Int32::New(noiseImpl(x, y, z, seed)));
}

Handle<Value> doubleNoise1(const Arguments& args)
{
	HandleScope scope;

	REQ_INT_ARG(0, seed);
	REQ_DOUBLE_ARG(1, x);

	int ix = (int)x;
	double fx = x - ix;

	double result = lerp(
		(double)noiseImpl(seed, ix  , 0, 0) / NOISE_MASK,
		(double)noiseImpl(seed, ix+1, 0, 0) / NOISE_MASK,
		smooth(fx)
	);

	return scope.Close(Number::New(result));
}

Handle<Value> doubleNoise2(const Arguments& args)
{
	HandleScope scope;

	REQ_INT_ARG(0, seed);
	REQ_DOUBLE_ARG(1, x);
	REQ_DOUBLE_ARG(2, y);

	int ix = (int)x, iy = (int)y;
	double fx = x - ix, fy = y - iy;

	double result = lerp(
		lerp(
			(double)noiseImpl(seed, ix,     iy, 0) / NOISE_MASK,
			(double)noiseImpl(seed, ix + 1, iy, 0) / NOISE_MASK,
			smooth(fx)
		),
		lerp(
			(double)noiseImpl(seed, ix,     iy + 1, 0) / NOISE_MASK,
			(double)noiseImpl(seed, ix + 1, iy + 1, 0) / NOISE_MASK,
			smooth(fx)
		),
		smooth(fy)
	);

	return scope.Close(Number::New(result));
}

Handle<Value> doubleNoise3(const Arguments& args)
{
	HandleScope scope;

	REQ_INT_ARG(0, seed);
	REQ_DOUBLE_ARG(1, x);
	REQ_DOUBLE_ARG(2, y);
	REQ_DOUBLE_ARG(3, z);

	int ix = (int)x, iy = (int)y, iz = (int)z;
	double fx = x - ix, fy = y - iy, fz = z - iz;

	double result = lerp(
		lerp(
			lerp(
				(double)noiseImpl(seed, ix,     iy, iz) / NOISE_MASK,
				(double)noiseImpl(seed, ix + 1, iy, iz) / NOISE_MASK,
				smooth(fx)
			),
			lerp(
				(double)noiseImpl(seed, ix,     iy + 1, iz) / NOISE_MASK,
				(double)noiseImpl(seed, ix + 1, iy + 1, iz) / NOISE_MASK,
				smooth(fx)
			),
			smooth(fy)
		),
		lerp(
			lerp(
				(double)noiseImpl(seed, ix,     iy, iz + 1) / NOISE_MASK,
				(double)noiseImpl(seed, ix + 1, iy, iz + 1) / NOISE_MASK,
				smooth(fx)
			),
			lerp(
				(double)noiseImpl(seed, ix,     iy + 1, iz + 1) / NOISE_MASK,
				(double)noiseImpl(seed, ix + 1, iy + 1, iz + 1) / NOISE_MASK,
				smooth(fx)
			),
			smooth(fy)
		),
		smooth(fz)
	);

	return scope.Close(Number::New(result));
}

extern "C"
{
	void init(Handle<Object> exports)
	{
		NODE_SET_METHOD(exports, "noise1", noise1);
		NODE_SET_METHOD(exports, "noise2", noise2);
		NODE_SET_METHOD(exports, "noise3", noise3);
		NODE_SET_METHOD(exports, "doubleNoise1", doubleNoise1);
		NODE_SET_METHOD(exports, "doubleNoise2", doubleNoise2);
		NODE_SET_METHOD(exports, "doubleNoise3", doubleNoise3);
	}

	NODE_MODULE(noise, init)
}
