#include <v8.h>
#include <node.h>

#define REQ_INT_ARG(I, VAR)                                             \
  int VAR;                                                              \
  if (args.Length() <= (I) || !args[I]->IsInt32())                      \
    return ThrowException(Exception::TypeError(                         \
                  String::New("Argument " #I " must be an integer")));  \
  VAR = args[I]->Int32Value();

using namespace v8;
using namespace node;

const int X_NOISE_GEN = 1619;
const int Y_NOISE_GEN = 31337;
const int Z_NOISE_GEN = 6971;
const int SEED_NOISE_GEN = 1013;

int noiseImpl(int x, int y, int z, int seed)
{
	int n = (
	    X_NOISE_GEN    * x
	  + Y_NOISE_GEN    * y
	  + Z_NOISE_GEN    * z
	  + SEED_NOISE_GEN * seed) & 0x7fffffff;

   n = (n >> 13) ^ n;

   return (n * (n * n * 60493 + 19990303) + 1376312589);// & 0x7fffffff;
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

extern "C"
{
	void init(Handle<Object> exports)
	{
		NODE_SET_METHOD(exports, "noise1", noise1);
		NODE_SET_METHOD(exports, "noise2", noise2);
		NODE_SET_METHOD(exports, "noise3", noise3);
	}

	NODE_MODULE(noise, init)
}
