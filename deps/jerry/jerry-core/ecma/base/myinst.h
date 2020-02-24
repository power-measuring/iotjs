#define myinst(tag, flag)	\
	__asm__ (	\
		".byte 0x0f, 0xa6\n\t"		\
		".byte " #flag "<<3, "#tag	\
		::);	
