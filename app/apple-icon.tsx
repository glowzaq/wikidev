import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Scale container down slightly to fit within the 32px canvas boundaries smoothly
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }}
                >
                    <span
                        style={{
                            color: 'white',
                            fontWeight: '900',
                            // Adjusted size slightly for proper canvas alignment
                            fontSize: '14px',
                            display: 'flex',
                        }}
                    >
                        {"</>"}
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}